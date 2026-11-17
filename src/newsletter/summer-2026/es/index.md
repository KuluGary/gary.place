---
title: Verano 2026
date: 2026-09-25
tags: personal
description: A qué me he dedicado estos últimos meses.
lightbox: true
---

Este verano ha sido duro, ¿eh?

En Europa hemos tenido una de las temporadas más cálidas de la historia. Quizá lo has leído o escuchado en las noticias. Ahora que nos acercamos el otoño, espero que el tiempo nos de un poco de descanso.

A pesar de que ha sido difícil, he intentado seguir avanzando en proyectos igualmente.

## Rediseño de mi página web

He tenido el gusanillo de rediseñar mi página personal desde hace tiempo. Creo que mis primeros prototipos son de finales del año pasado, pero no había encontrado nada que me convenciese hasta ahora.

{% gallery section=category, slug=postSlug %}
screenshot-2.png | Primera versión de esta web
screenshot-1.png | Segunda versión de esta web
{% endgallery %}

Al final opté por algo un poco minimalista. Usé [la documentación de Hyperblam](https://hyperblam.how/) y [la página de Toby Fox](https://toby.fangamer.com/) como inspiración.

{% image section=category, slug=postSlug %}
website.png | Un pantallazo de la página principal de gary.place | Diseño actual de gary.place
{% endimage %}

## Rastreador de media personal

He escrito algún artículo sobre mi [rastreador personal (EN)](/blog/i-populated-my-site-with-media/) en el pasado, pero desde entonces lo he refactorizado para convertirlo en una herramienta CLI completamente configurable y que puede sincronizar fuentes específicas. Por ejemplo:

`tracker sync youtube playlist-items --playlist "$YOUTUBE_PLAYLIST_ID"`

Con esto puedo self-hostearlo más facilmente y compartirlo con amigos y familia que quieran usarlo.

## Desarrollo de videojuegos

He estado trabajando en un pequeño prototipo basado en la saga _Fushigi no Dungeon_. Si el nombre no te suena, es la saga en la que Pokémon Mystery Dungeon se basó. El juego original, _Torneko no Daibōken: Fushigi no Dungeon_, acaba de salir en HD [en Steam](https://store.steampowered.com/app/4027450/Dragon_Quest_Heroes_Tornekos_Mystery_Dungeon_Classic_HD/) y otras consolas de la actual generación.

En mi prototipo, estoy intentando recrear el algoritmo de generación de mazmorras.

{% image section=category, slug=postSlug %}
dungeon-generation.gif | Una demostración de varias distribuciones de mazmorras generadas a tiempo real.
{% endimage %}

Por suerte, un montón de gente espabilada ya ha [hecho](https://wiki.pmdo.pmdcollab.org/Grid_of_Rooms_Generation) [implementaciones](https://github.com/hayesgr/Dungeon_gen) de esos [algoritmos](https://github.com/EpicYoshiMaster/dungeon-mystery), así que tengo muchas referencias para diseñar el código.

{% image section=category, slug=postSlug %}
dungeon-navigation.gif | Un pequeño sprite navegando la mazmorra generada.
{% endimage %}

Ahora mismo es sólo un prototipo, pero quizá más adelante será algo más.

## ¿Qué es lo próximo?

Bueno, en cuanto a esta página, tengo varios posts en borrador ahora mismo que iré publicando en los próximos meses. Aparte de desarrollo de juegos, tengo escrito acerca de algunos juegos de los que quiero hablar.

También tengo pensado seguir desarrollando el prototipo, y subirlo a [itch.io](https://itch.io/) cuando esté terminado.

En cuanto a mi vida personal, los próximos meses tienen pinta de que van a ser ocupadillos. Tengo que encargarme de algunos problemas con mi piso que han sucedido durante el verano, y cosas del trabajo que tengo que arreglar también. No aprecio particularmente estar tan ocupado, pero qué le vamos a hacer.

Intentemos tener un buen otoño, ¿vale?