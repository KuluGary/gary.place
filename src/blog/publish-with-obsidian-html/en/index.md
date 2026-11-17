---
title: Publish your notes with ObsidianHTML
date: 2024-02-11
lang: en
codify: true
tags: ["web-dev"]
description: Thanks to the ObsidianHTML package, you can convert your regular Obsidian vaults into fully fledged websites.
---

For a while, I've been using the [Obsidian](https://obsidian.md/) tool to organize work documents, make charts for game development, or keep a series of notes for my role campaigns. This tool has been very useful thanks to its simple and dynamic [Markdown](https://www.markdownguide.org/tools/obsidian/) system, its great collection of [plugins](https://obsidian.md/plugins), and its ability to be customized through [with CSS](https://help.obsidian.md/Extending+Obsidian/CSS+snippets).

The only issue I have encountered is that it depends on its own [paid service to publish your Vault online](https://obsidian.md/publish). This has brought me to search for an alternative, and I have found an interesting package called [ObsidianHTML](https://obsidian-html.github.io/), which transforms Obsidian's Markdown files into HTML that can be hosted online easily.

Since it's a niche package, I've decided to write this article to explain how I've set up my tools to manage the generation of a website from my [Obsidian](https://obsidian.md/) Vault.

## Preparing the environment

[ObsidianHTML](https://obsidian-html.github.io/) documentation to install the package and set-up the environment is very intuitive. They have a [guide to install on Windows](https://obsidian-html.github.io/instructions/tutorials/tutorial-installation-on-windows.html) you can follow to prepare the environment. After following it, this is how I have it.

```bash
> python --version
Python 3.11.0

> obsidianhtml version
4.0.1
```

I've also made a series of folders from which I will manage the file generation. The structure should be something like this.

```sh
┌── compile.sh
├── config.yaml
├── .git
├── assets
├── output
└── website
```

This structure has two files and four folders. `.git` has our version control, `assets` is where we can put our CSS and JavaScript files that we want to include, `output` is where the generated HTML files will end up with [ObsidianHTML](https://obsidian-html.github.io/) and `website` is where we will manage our remote repository.

## General introduction

The system as I use it is made up of two files, `compile.sh` and `config.yaml`.

- `compile.sh` is a bash script that executes commands to generate the HTML files and, based on whether you pass the `deploy` or `serve` parameter, either starts up a local server or makes a commit and pushes it to the remote repository to trigger our CI/CD process.
- `config.yaml` is the configuration that [ObsidianHTML](https://obsidian-html.github.io/) uses to generate your HTML files.

## Default configuration

The `config.yaml` file has the configs used by ObsidianHTML to create your HTML files. Here you can add or remove configurations, and you can check which ones are available in the [ObsidianHTML documentation](https://obsidian-html.github.io/).

**Note**: If you want to get the default configuration that ObsidianHTML uses, you can auto-generate a `config.yaml` file with the `obsidianhtml export default-config -o config.yaml` command.

```yaml
# The note that will be used as the index.html
# should be in obsidian_folder_path_str
# Use full path or relative path, but don't use ~/

obsidian_entrypoint_path_str: "/path-to-your-vault/Index.md"
```

One of the most important elements is the path to your initial file. You can think about it as if it were the root `index.html` of a normal website.

```yaml
site_name: "Site name"
```

The site_name allows you to establish the `title` of your page.

```yaml
# Provide an array of custom inclusions (css, javascript, etc) that you would like to be included in the resultant html

html_custom_inclusions:
  - '<link rel="stylesheet" href="/custom.css" />'
```

You can also add a list of files you want to add to the HTML output. This is what we will use if we want to include custom styling or load JS files.

There are tons of extra options. As an example, this is what I use.

```yaml
toggles:
  features:
    graph:
      enabled: false
    breadcrumbs:
      enabled: true
    embedded_note_titles:
      enabled: false
    table_of_contents:
      add_toc_when_missing: True
      only_show_for_multiple_headers: True
    side_pane:
      left_pane:
        enabled: True
        close_if_empty: True
        contents: toc
      right_pane:
        enabled: false
```

### Public and private notes

An important requirement for my use case is that, be it because the Note is private or it's still in progress, it's important to be able to pick which notes I want to publish and which I want to keep private.

[ObsidianHTML](https://obsidian-html.github.io/) allows you to use a module to filter notes based on the metadata of each note.

```yaml
module_config:
  filter_on_metadata:
    include_on:
      value: [[{ "present": "visibility" }, { "equals": ["visibility", "public"] }]]
```

This configuration is explained in [the documentation](https://obsidian-html.github.io/configurations/modules/filter-on-metadata.html), and in this case, I use it like this:

```md
---
visibility: public
---
```

Inside each one of our notes, we will make use of the frontmatter to add a tag (in my case, `visibility`, but you can make up whatever you want) to be able to select which notes we want to publish. Every note without this tag or with a different value will be ignored by the [ObsidianHTML](https://obsidian-html.github.io/) conversor.

This methodology allows you to have very granular control over which notes we want to publish. In this way, we can publish a few notes at a time and make sure we don't make work in progress public.

However, it's a bit of work if what we want is to publish most notes and only pick which ones we don't want to share. In this case, we can make use of the following configuration:

```yaml
module_config:
  filter_on_metadata:
    exclude_on:
      value: [[{ "present": "visibility" }, { "equals": ["visibility", "private"] }]]
```

In this way, what we ask of ObsidianHTML is for it to exclude every Note that has the tag `visibility: private` in its frontmatter, like this:

```md
---
visibility: private
---
```

[ObsidianHTML](https://obsidian-html.github.io/) has other ways of working with Note filtering. If instead of filtering based on Notes you want to filter based on folders, file types, or other _patterns_, there's a whole section in its [documentation](https://obsidian-html.github.io/configurations/modes/filtering-notes.html) explaining how to do it.

## Automation with Bash

To automate the whole process and be able to execute locally / publish Notes, I've made a `.sh` file that executes a series of commands. This is not a required part of using this package, but it makes its use more friendly.

This script is in charge of, generally, three things.

1. Generating the HTML files from the Markdown files of our Vault.
2. Moving the output to a `website` folder.
3. Manage what we do with our website.
   1. If we use the `serve` parameter, it opens a local server pointing to the `website`.
   2. If we use the `deploy` parameter, it makes a commit and pushes it to the remote repository.

The content of the script is the following:

```sh
# Close if argument 'deploy' or 'serve' not specified
if [[ $# == 0 ]]; then
  echo "Please provide arguments"
  exit 0;
fi
```

If you don't pass any arguments to the script, it fails. It requires either `serve` or `deploy`.

```sh
cd "$(dirname "$0")"

# Generate files
rm -rf output
python -m obsidianhtml convert -i config.yaml
cp -fr ./assets/custom.css ./output/html
```

This part of the script generates the HTML files using [ObsidianHTML](https://obsidian-html.github.io/) inside the `output` folder and then puts our custom CSS file with it.

```sh
cd website
find . -path ./.git -prune -o -exec rm -rf {} \; 2> /dev/null
cd ..
cp -fr ./output/html/** ./website
```

The `website` folder is what we will use as a remote repository, and it has a Git repository initiated inside and connected to a service like Github.

```sh
if [[ $1 = 'deploy' ]]; then
	cd website
  git add .
  git commit -m "$(date +%F_%H-%M-%S)"
  git push
fi
```

Here, what we do is upload our website to our remote repository. Thanks to this, we can execute a deploy process through a CI/CD pipeline to host our website publicly.

```sh
if [[ $1 = 'serve' ]]; then
	python -m obsidianhtml serve --directory website --port 8000
fi
```

If instead we use `serve`, we create a local server pointing to our "website" on the 8000 port. Thanks to this, if we access `localhost:8000` we can see our website as it will be when we publish it.

## Deploying online

Once we have our "website" folder generated, we can treat it as any other web project. There are hundreds of ways to manage hosting: For example, I use [Netlify](https://www.netlify.com/) to [publish my website automatically](https://docs.netlify.com/get-started/#deploy-a-project-to-netlify) every time I push a commit to my remote repository.

## Appendix

After having configured the whole process, we have an automated way to generate a website using our [Obsidian](https://obsidian.md/) Vault. Saldy, late last year it was [announced the package will no longer be mantained by its author](https://github.com/obsidian-html/obsidian-html/issues/759), and even if it is always sad for such a tool to lose support, we can still get lots of juice out of its use, and who knows, maybe someone will fork it and add functionality in the future.

Either way, I hope this article is of help. If you have questions, don't hesitate to contact me through the [form in the main page](/).
