---
title: Installation
weight: 1
linkTitle: Getting Started
next: /docs/guide
prev: /docs
---

{{% steps %}}

### Create a repository with the template
* From our [GitHub Repository](https://github.com/vanityURLs/vanityURLs), use the `Use this template button` and `Create a new repository`
![Cloudflare SignUp](/images/getting-started-1.png)
* Select private repository type and click  `Create a repository`
    * In this picture, we have chosen `my-tiny.link` to reflect the chosen domain name; pick a name that makes senses to you
![Cloudflare SignUp](/images/getting-started-2.png)
* This part is now completed
![Cloudflare SignUp](/images/getting-started-3.png)
### Create your Cloudflare account
* Follow Cloudflare [instruction](https://developers.Cloudflare.com/fundamentals/setup/account/create-account/)
![Cloudflare SignUp](/images/getting-started-4.png)
### Purchase your internet domain
* Login to Cloudflare and click on register a new domain
![Cloudflare SignUp](/images/getting-started-5.png)
* Type your desired domain name, click search and then purchase it
![Cloudflare SignUp](/images/getting-started-6.png)
* Fill the registrant information and proceed with payment
![Cloudflare SignUp](/images/getting-started-7.png)
* Don't forget to `Enable auto renew`
![Cloudflare SignUp](/images/getting-started-08.png)
### Create the page site
1. Click on `Add  pages Site`
![Cloudflare SignUp](/images/getting-started-9.png)
2. Connect to the GitHub repository,
    * If you're a GitLab user follow [additional documentation](https://developers.Cloudflare.com/pages/get-started/guide/#connect-your-git-provider-to-pages) from Cloudflare


![Cloudflare SignUp](/images/getting-started-10.png)

### To be reviewed
    * Configure your deployment and build setup:
      * Framework preset: (leave empty)
      * Build command: `cat static.lnk dynamic.lnk > build/_redirects`
      * Build output directory: `/build`
    * The build will fail as you still need to generate `static.lnk`, `dynamic.lnk`, and `build/_headers` later in the process
4. Setup a [custom domain](https://developers.Cloudflare.com/pages/platform/custom-domains/) for your page project
    * Configure the DNS entry via [Cloudflare DNS](https://dash.Cloudflare.com/)

### Local config

5. Define your configuration in the `vanityURLs.conf` with your preferred text editor or via `make config` if `vi` is your cup of tea
    * SCRIPT_DIR: the path to your local scripts folder included in your path
    * REPO_DIR: the path to your local copy of vanityURLs
    * MY_DOMAIN: your tiny internet domain served by Cloudflare
    * MY_PAGE: your Cloudflare's specific page URL
6. Build your initial setup with `make setup`
    * Generate the [header configuration](../build/_headers) based on your Cloudflare's specific page URL and _tiny_ internet domain name
    * Generate the initial [static.lnk](../static.lnk) and [dynamic.lnk](../dynamic.lnk)
7. Update the [static](../static.lnk) and [dynamic](../dynamic.lnk) redirection lists with your preferred text editor and the [`lnk` bash script](../script/lnk)
8. Update the main branch of your local git repository and push to GitHub
9. Cloudflare will detect the change and initiate a deployment, please give ~15 seconds for your links to become valid
10. Open the defined fully qualified domain name for your _tiny_ internet domain name in your web browser, and you should be redirected to https://BHDicaire.com based on the [initial configuration](../build/_redirects)
11. Fine tune the [static](../static.lnk) and [dynamic](../dynamic.lnk) redirection lists with your preferred text editor and the [`lnk` bash script](../scripts/lnk)
12. Add and commit the change to the github repository
{{% /steps %}}
