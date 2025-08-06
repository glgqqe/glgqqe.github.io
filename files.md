---
layout: default
title: Файлы
---

<h1>Список файлов</h1>

<ul>
{% for file in site.static_files %}
    {% if file.path contains '/files/' %}
        <li>
            <a href="{{ file.path }}">{{ file.name }}</a>
        </li>
    {% endif %}
{% endfor %}
</ul>
