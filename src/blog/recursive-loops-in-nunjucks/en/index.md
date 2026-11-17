---
title: Recursive Loops in Nunjucks
date: 2024-10-20
tags: ["web-dev", "nunjucks"]
codify: true
description: Learn to recursively generate HTML markup with Nunjucks using a static JSON file.
---

While re-writing my [Quizzes page](/quizzes) so it's easier to manage, I decided I wanted to separate the HTML markup from the raw data. The problem came when I realized that I needed to recursively generate the HTML so it was made up of nested lists with links.

Thankfully I found a [Github issue](https://github.com/mozilla/nunjucks/issues/416) from someone with the same problem as me. In the issue, there was a [response from jbmoelker](https://github.com/mozilla/nunjucks/issues/416#issuecomment-206335032) in which they solved the problem with a macro.

## Nunjucks macros

From the [Nunjucks documentation](https://mozilla.github.io/nunjucks/):

> `macro` allows you to define reusable chunks of content. It is similar to a function in a programming language.

Thanks to the reusable quality of macros, you can easily use them to make nested lists recursively.

## Setting up the data

The first step was to set-up the `quizzes.json` file which contain all the raw data with which to populate the HTML markup. Here's a snippet of that file:

```json
## quizzes.json
[
  {
    "title": "MBTI",
    "children": [
      {
        "title": "16Personalities",
        "url": "https://www.16personalities.com",
        "children": [
          {
            "title": "INFJ-T (Turbulent Advocate)",
            "url": "https://www.16personalities.com/infj-personality"
          }
        ]
      },
      {
        "title": "The Michael Caloz Cognitive Functions Test",
        "url": "http://https://www.michaelcaloz.com/personality/",
        "children": [
          {
            "url": "https://www.michaelcaloz.com/personality/index.html?screen=last&Ti=6&Te=2&Fi=9&Fe=11&Si=4&Se=8&Ni=6&Ne=6&SJ=0&NF=1.5&NT=1.5&SP=0&iFi=0&iTi=0&iSi=1&iNi=0&iFe=0&iTe=1&iSe=0&iNe=1&E=0&I=2&N=2&S=0&T=0&F=2&J=0&P=0",
            "title": "INFJ / INFP"
          }
        ]
      }
    ]
  }
]
```

As you can see, the basic structure of each object requires a `title` property, and optionally can include a `url` property and an object list called `children` which contains the same recursive object structure.

## Applying the Macro

Now that we have the basic data, we need to generate the nunjucks template in order to get the HTML markup structure correctly.

{% raw %}

```njk
{% macro quizzItem(quizz) %}
<li>
  {% if quizz.url %}
  <a href="{{ quizz.url }}">{{ quizz.title }}</a>
  {% else %} {{ quizz.title }} {% endif %} {% if quizz.children %}
  <ul>
    {% for item in quizz.children %} {{ quizzItem(item) }} {% endfor %}
  </ul>
  {% endif %}
</li>
{% endmacro %}
```

{% endraw %}

In this macro we manage the conditions to print the correct HTML. If the quizz item has an `url` property, it puts the title inside an anchor tag. Otherwise, it's a regular text element. If the quizz item has the `children` property, it prints a new unordered list and the macro calls itself to generate lists in recursion. To start running this recursion, I just called it inside a for loop of all quizzes.

{% raw %}

```njk
<main>
  <ul>
    {% for quizz in quizzes %} {{ quizzItem(quizz) }} {% endfor %}
  </ul>
</main>
```

{% endraw %}

## Notes and pitfalls

The only pitfall I fell into is the fact that you can't declare the macro inside a block declaration. As said in the documentation: > If you are using the asynchronous API, please be aware that you cannot do anything asynchronous inside macros. This is because macros are called like normal functions. In the future we may have a way to call a function asynchronously. If you do this now, the behavior is undefined. So in order to fix this, I set up the whole file in these maner:

{% raw %}

```njk
{% macro quizzItem(quizz) %}
  <li>
    {% if quizz.url %}
      <a href="{{ quizz.url }}">{{ quizz.title }}</a>
    {% else %}
      {{ quizz.title }}
    {% endif %}
    {% if quizz.children %}
      <ul>
        {% for item in quizz.children %}
          {{ quizzItem(item) }}
        {% endfor %}
      </ul>
    {% endif %}
  </li>
{% endmacro %}

<main>
  <ul>
    {% for quizz in quizzes %} {{ quizzItem(quizz) }} {% endfor %}
  </ul>
</main>
```

{% endraw %}

## Conclusion

Thanks to this set-up, I can more easily add data to my new json file and not have to worry about the markup structure, and I can
also re-structure the HTML markup easily if I ever want to. If you want to check the result, you can check my [Quizzes page](/quizzes).
