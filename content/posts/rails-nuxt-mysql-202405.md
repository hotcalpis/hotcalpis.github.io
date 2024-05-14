---
title: 'Rails + Nuxt + Mysql の環境構築(2024/05)'
date: '2024-05-14'
description: ''
---

なるべく公式ドキュメントに従い、一般的な構成になるように進めます。

## Mysql

https://hub.docker.com/_/mysql

公式の Docker Image ドキュメントに docker-compose の例が載っているので参考にしつつ設定します。

```yml
version: '3.1'
services:
  db:
    image: mysql:8.0
    command: --default-authentication-plugin=mysql_native_password
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: password
    ports:
      - '3306:3306'
    volumes:
      - mysql:/var/lib/mysql
volumes:
  mysql:
```

## Rails

### Ruby および rbenv

https://github.com/rbenv/rbenv?tab=readme-ov-file#installation
https://www.ruby-lang.org/en/downloads/releases/

ドキュメントに従って最新版の Ruby をインストールしましょう。

### rails new

rails new xxx --api --minimal -d mysql

最小構成にしたいので --api と --minimal を指定します。
他の細かいオプションは `Rails new --help` で確認できます。

### ruby-lsp

https://marketplace.visualstudio.com/items?itemName=Shopify.ruby-lsp

VSCode を使う想定で以下を実施します。

1. 拡張機能 `Ruby LSP` をインストール
2. 上記のリンクを参考に .vscode/settings.json に設定を追加

```json
{
  "editor.formatOnSave": true,
  "[ruby]": {
    "editor.defaultFormatter": "Shopify.ruby-lsp",
    "editor.tabSize": 2,
    "editor.insertSpaces": true,
    "editor.semanticHighlighting.enabled": true,
    "editor.formatOnType": true
  },
  "rubyLsp.formatter": "rubocop"
}
```

### config/database.yml

MySQL コンテナと接続するために以下を設定します。
（余談）Rails もコンテナ化して docker-compose で管理する場合は `host: [MySQLコンテナのサービス名]` にします。

```yml
username: root
password: password
host: 127.0.0.1
```

### rubocop

https://github.com/rubocop/rubocop?tab=readme-ov-file#installation

Gemfile の development グループに `gem 'rubocop', require: false` を追加します。

### rspec_rails および factory_bot_rails

https://github.com/rspec/rspec-rails?tab=readme-ov-file#installation
https://github.com/thoughtbot/factory_bot_rails?tab=readme-ov-file#configuration

Gemfile の development,test グループに `gem 'rspec-rails'` `gem 'factory_bot_rails'` を追加します。
`bundle install` `rails g rspec:install` を実行します。

https://github.com/thoughtbot/factory_bot/blob/main/GETTING_STARTED.md#configure-your-test-suite

rails_helper.rb に factory_bot 用の設定を追加します。

```rb
RSpec.configure do |config|
  config.include FactoryBot::Syntax::Methods
end
```

## Nuxt

拡張モジュールは色々ありますが、一般的な設定として公式ドキュメントに記載のあるモジュールを入れていきます。
https://nuxt.com/docs/getting-started/configuration#external-configuration-files

### Node および Volta

https://docs.volta.sh/guide/getting-started
https://nodejs.org/en/about/previous-releases

バージョン管理ツールとして Volta を選びましたが、正直どれがベストなのか判別つきませんでした :sweat_smile

### nuxi

https://nuxt.com/docs/getting-started/installation

Nuxt3 はデフォルトで最小構成なのでドキュメント通りで OK です。

### Vue - Official

https://ja.vuejs.org/guide/scaling-up/tooling#ide-support

VSCode に拡張機能 `Vue - Official` をインストールします。

### ESLint

https://nuxt.com/docs/guide/concepts/code-style
https://eslint.nuxt.com/packages/module
https://nuxt.com/blog/eslint-module

1. `npx nuxi module add eslint`
2. yarn → yarn dev

今回は Formatter として Prettier ではなく ESLint stylistic を採用しました。

```js
export default defineNuxtConfig({
  modules: ['@nuxt/eslint'],
  eslint: {
    config: {
      stylistic: true,
    },
  },
})
```

### Sass

https://nuxt.com/docs/getting-started/styling#using-preprocessors

`yarn add --dev sass`

```
export default defineNuxtConfig({
  css: ['~/assets/sass/main.sass']
})
```

### tailwindcss

https://tailwindcss.nuxtjs.org/getting-started/installation
https://tailwindcss.com/docs/guides/nuxtjs

tailwindcss の公式ドキュメントには Nuxt Module を使う方法と使わない方法が載っています。
設定が少なく済みそうなので Nuxt Module を使います。

### test-utils

https://nuxt.com/docs/getting-started/testing

## 他

### package.json

name を変更しておきましょう。

### .gitignore

https://yarnpkg.com/getting-started/qa#which-files-should-be-gitignored

```yml
.DS_Store

.pnp.*
.yarn/*
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/sdks
!.yarn/versions
```

一旦こんなところで…おそらく後で追記/編集します。
