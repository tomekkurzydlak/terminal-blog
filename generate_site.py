from jinja2 import Environment, FileSystemLoader
import markdown
import os
from pathlib import Path
import yaml

POSTS_DIR = Path("posts")
OUTPUT_DIR = Path("site/posts")
TEMPLATE_DIR = Path("templates")

env = Environment(loader=FileSystemLoader(TEMPLATE_DIR))
template = env.get_template("base.html")

posts = list(POSTS_DIR.glob("*.md"))
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

for post_path in posts:
    with open(post_path, "r", encoding="utf-8") as f:
        content = f.read()

    if content.startswith('---'):
        parts = content.split('---', 2)
        meta = yaml.safe_load(parts[1])
        body_md = parts[2]
    else:
        meta = {'title': 'Untitled', 'date': 'Unknown'}
        body_md = content

    html_body = markdown.markdown(body_md, extensions=["fenced_code", "codehilite"])
    rendered = template.render(title=meta["title"], content=html_body)

    output_path = OUTPUT_DIR / (post_path.stem + ".html")
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(rendered)
