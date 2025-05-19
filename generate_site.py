from jinja2 import Environment, FileSystemLoader
import markdown
import os
from pathlib import Path
import yaml

POSTS_DIR = Path("posts")
OUTPUT_DIR = Path("site/posts")
TEMPLATE_DIR = Path("templates")
INDEX_PATH = Path("site/index.html")

env = Environment(loader=FileSystemLoader(TEMPLATE_DIR))
template = env.get_template("base.html")

posts = sorted(POSTS_DIR.glob("*.md"), reverse=True)

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

index_links = []

for post_path in posts:
    with open(post_path, "r", encoding="utf-8") as f:
        content = f.read()

    if content.startswith('---'):
        parts = content.split('---', 2)
        meta = yaml.safe_load(parts[1])
        body_md = parts[2]
    else:
        meta = {'title': post_path.stem, 'date': 'Unknown'}
        body_md = content

    html_body = markdown.markdown(body_md, extensions=["fenced_code", "codehilite"])
    rendered = template.render(title=meta["title"], content=html_body)

    output_filename = post_path.stem + ".html"
    output_path = OUTPUT_DIR / output_filename
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(rendered)

    index_links.append(f'- <a href="/posts/{output_filename}">{meta["title"]}</a>')

# 🔁 Update index.html
if INDEX_PATH.exists():
    with open(INDEX_PATH, "r", encoding="utf-8") as f:
        index_html = f.read()

    if "<!-- GENERATED_ARTICLE_LIST -->" in index_html:
        updated_html = index_html.replace(
            "<!-- GENERATED_ARTICLE_LIST -->",
            "<!-- GENERATED_ARTICLE_LIST -->\n" + "<br>\n".join(index_links)
        )
        with open(INDEX_PATH, "w", encoding="utf-8") as f:
            f.write(updated_html)
    else:
        print("⚠️ No GENERATED_ARTICLE_LIST placeholder found in index.html")
