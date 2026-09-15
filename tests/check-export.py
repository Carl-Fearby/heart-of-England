"""Check the actual static output before spending a deployment credit."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import json
import xml.etree.ElementTree as ET
from html import unescape

root = Path('out')
class Page(HTMLParser):
    def __init__(self, text):
        super().__init__(); self.tags=[]; self.feed(text)
    def handle_starttag(self, tag, attrs): self.tags.append((tag,dict(attrs)))
    def find(self, tag, **attrs):
        return [a for t,a in self.tags if t==tag and all(a.get(k)==v for k,v in attrs.items())]
def page(path): return Page((root/path).read_text())
def target(path):
    p=root/unquote(path.lstrip('/'))
    return p/'index.html' if path.endswith('/') or not p.suffix else p

routes=json.loads(Path('.next/prerender-manifest.json').read_text())['routes']
public=[route for route in routes if not route.startswith('/_') and not route.endswith(('.xml','.txt'))]
for route in public:
    file=target(route if route.endswith('/') else route+'/')
    assert file.exists(), f'Missing route: {route}'
    p=Page(file.read_text())
    canonical=p.find('link',rel='canonical')
    assert len(canonical)==1, f'Expected one canonical for {route}'
    assert target(urlsplit(canonical[0]['href']).path).exists(), f'Invalid canonical for {route}'
    for tag,attrs in p.tags:
        if tag in ('img','script') and attrs.get('src','').startswith('/'):
            assert target(urlsplit(attrs['src']).path).exists(), f'Missing asset on {route}: {attrs["src"]}'

for route in ['contact/index.html','contact-us/index.html']:
    p=page(route)
    assert p.find('link',rel='canonical')[0]['href']=='https://heartofengland.uk/contact-us/'
    form=p.find('form',name='event-enquiry')[0]
    assert form['method'].lower()=='post' and form['data-netlify']=='true'
    assert form['netlify-honeypot']=='bot-field'
    for name in ['form-name','bot-field','name','email','event-date','guests']:
        assert p.find('input',name=name),f'Missing form field: {name}'
rooms = page('rooms-and-spaces/index.html')
room_html = unescape((root/'rooms-and-spaces/index.html').read_text())
for label in ['Plan an event', 'Rooms & spaces', 'What’s on', 'Eat & stay', 'About']:
    assert label in room_html, f'Missing primary navigation label: {label}'
for control in ['room-guests', 'room-use', 'room-layout']:
    assert rooms.find('input',id=control) or rooms.find('select',id=control), f'Missing room finder control: {control}'
assert not page('index.html').find('iframe'), 'Homepage video must not load before interaction'
assert 'noindex' in page('enquiry-received/index.html').find('meta',name='robots')[0]['content']
locations=[node.text for node in ET.parse(root/'sitemap.xml').findall('.//{*}loc')]
assert len(locations)==len(set(locations)), 'Duplicate sitemap URLs'
for url in locations:
    path=urlsplit(url).path
    assert path not in ['/contact/','/home/','/about/','/spaces/','/enquiry-received/']
    assert target(path).exists(),f'Missing sitemap destination: {url}'
print(f'Passed: {len(public)} HTML routes, canonical destinations, page assets, Netlify form fields, no autoplay iframe, and {len(locations)} unique sitemap entries.')
