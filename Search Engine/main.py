from exa_py import Exa
import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env from the same folder as this script, not the current working dir.
env_path = Path(__file__).with_name('.env')
load_dotenv(dotenv_path=env_path)

# Prefer EXA_API_KEY from .env or environment; fallback to config.py if present.
exa_key = os.getenv('EXA_API_KEY')
if not exa_key:
  try:
    import config
    exa_key = getattr(config, 'EXA_API_KEY', None)
  except Exception:
    exa_key = None

if not exa_key:
  raise RuntimeError('Missing EXA_API_KEY. Add it to .env or config.py.')

exa = Exa(exa_key)
query = input("Enter your search query: ")
response = exa.search(
    query,
    num_results=10,
    type='auto',
    include_domains=['https://www.tiktok.com', 'https://www.youtube.com', 'https://www.reddit.com',  'https://www.facebook.com'],
)
for result in response.results:
  print(f'Title: {result.title}')
  print(f'URL: {result.url}')
  print()