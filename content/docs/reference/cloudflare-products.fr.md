---
aside: false
title: "Produits Cloudflare"
description: "Produits et surfaces du tableau de bord Cloudflare que vanityURLs utilise dans son baseline operationnel."
weight: 20
---

vanityURLs est un raccourcisseur d'URL qui fonctionne sur le reseau edge de Cloudflare avec votre _propre_ domaine.

<table class="w-full table-fixed">
  <thead>
    <tr>
      <th class="w-1/3 align-top">Produit</th>
      <th class="w-2/3 align-top">Role dans vanityURLs</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><a href="https://www.cloudflare.com/products/dns/">Cloudflare DNS</a></td>
      <td>DNS autoritatif du domaine court, incluant l'enregistrement proxifie du domaine personnalise du Worker</td>
    </tr>
    <tr>
      <td><a href="https://www.cloudflare.com/products/workers/">Cloudflare Workers</a></td>
      <td>Runtime pour les redirections, les pages operationnelles protegees, les ressources statiques generees et l'envoi d'analytics cote serveur</td>
    </tr>
    <tr>
      <td><a href="https://www.cloudflare.com/products/access/">Cloudflare Access</a></td>
      <td>Protection Zero Trust Network Access (ZTNA) pour les surfaces operationnelles protegees, comme le tableau de bord Stats et la matrice de tests runtime</td>
    </tr>
    <tr>
      <td><a href="https://www.cloudflare.com/products/ssl/">Cloudflare SSL/TLS</a></td>
      <td>Certificats edge, Universal SSL, enforcement HTTPS et configuration TLS minimale</td>
    </tr>
  </tbody>
</table>

## Protection reseau avant que le trafic atteigne l'instance vanityURLs

<table class="w-full table-fixed">
  <thead>
    <tr>
      <th class="w-1/3 align-top">Produit ou surface</th>
      <th class="w-2/3 align-top">Role dans vanityURLs</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><a href="https://www.cloudflare.com/products/waf/">Web Application Firewall</a></td>
      <td>Regles de securite personnalisees pour les sondes de scanner, les methodes inattendues, les clients suspects, les crawlers IA non desires et les autres trafics bloques a l'edge</td>
    </tr>
    <tr>
      <td><a href="https://www.cloudflare.com/products/rate-limiting/">Cloudflare Rate Limiting</a></td>
      <td>Limitation de debit pour les comportements abusifs qui ne devraient pas consommer de ressources Worker</td>
    </tr>
    <tr>
      <td><a href="https://www.cloudflare.com/ddos/">Distributed Denial-of-Service (DDoS) Protection</a></td>
      <td>Protection reseau toujours active</td>
    </tr>
    <tr>
      <td><a href="https://www.cloudflare.com/products/bot-management">Cloudflare Bot Management</a></td>
      <td>Controles bot utilises pour reduire l'abus automatise avant que les requetes atteignent le Worker</td>
    </tr>
    <tr>
      <td><a href="https://developers.cloudflare.com/bots/concepts/bot/#ai-crawlers">Cloudflare AI Crawl Control</a></td>
      <td>Controles propres a certaines familles de crawlers IA</td>
    </tr>
    <tr>
      <td><a href="https://developers.cloudflare.com/rules/">Cloudflare Rules</a></td>
      <td>Managed Transforms et normalisation des URL avant que le trafic atteigne l'instance vanityURLs</td>
    </tr>
    <tr>
      <td><a href="https://developers.cloudflare.com/waf/analytics/security-events/">Cloudflare Security Events</a></td>
      <td>Surface de revue pour les mitigations appliquees avant l'execution du Worker</td>
    </tr>
  </tbody>
</table>

Cloudflare est une plateforme de type logiciel-service en evolution continue : fonctionnalites, API, libelles du tableau de bord et navigation peuvent changer sans numero de version majeur. Pour garder la documentation alignee avec cette surface mouvante, vanityURLs maintient une [capture structuree du tableau de bord Cloudflare](https://github.com/vanityURLs/website/blob/main/data/cloudflare-protection-defaults.json) en JSON. Cette capture aide les mainteneurs a comparer les changements d'interface dans le temps et a mettre la documentation a jour de facon deliberee. Pour le raisonnement de maintenance, consultez [ADR 0012](https://github.com/vanityURLs/code/blob/main/docs/adr/0012-maintain-cloudflare-dashboard-capture.md) et [The JSON audit ledger behind the Cloudflare setup docs](/blog/json-audit-ledger-for-cloudflare-docs/).
