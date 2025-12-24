# BioDB Next

Next.js / PostgreSQL を使ったバイオデータベース演習用プロジェクト

## 必要な環境

- Docker Desktop
- Node.js 18以上
- Git


### Node.jsのインストール方法

- [Node.js公式サイト](https://nodejs.org/)からVoltaによりLTSバージョンをインストールすることを推奨します。


```bash
# macOSを含むほとんどのUnixシステムでは1つのコマンドでインストールできます：
winget install Volta.Volta

# Node.jsのLTSバージョンをダウンロードしてインストールする：
volta install node@lts

# Node.jsのバージョンを確認する：
node -v # "v24.12.0"が表示される。

# npmのバージョンを確認する：
npm -v # "11.6.2"が表示される。
```


### Gitのインストール方法

- [Git公式サイト](https://git-scm.com/)からインストールしてください。

## セットアップ手順

### 1. リポジトリのクローンと依存関係のインストール

```bash
git clone <repository-url>
cd biodb-next
npm install
```

### 2. PostgreSQL（Docker）の起動

```bash
# Docker Compose でPostgreSQLコンテナを起動
docker compose up -d

# コンテナが起動したか確認
docker ps
```

### 3. データベースの初期化

以下のどちらかのSQLスクリプトを実行してデータベースを作成・初期化します。

#### demo データベース（PDB関連）

```bash
docker exec -i docker-postgres psql -U user -d postgres -f /home/user/SQL/demo.sql
```

#### database1（業者・商品・発注・納入）

```bash
docker exec -i docker-postgres psql -U user -d postgres -f /home/user/SQL/setting.sql
```


#### dockerにbashで入ってから作成する方法もあります

```bash
docker exec -i docker-postgres bash

psql -U user -d postgres -f demo.sql
psql -U user -d postgres -f setting.sql
```

### 4. 開発サーバーの起動

## .env.local ファイルを作成し、以下の環境変数を設定します：

```bash
cp example.env.local .env.local
```

必要に応じて `.env.local` 内のデータベース接続情報を修正してください。

その後、開発サーバーを起動します：

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開く

## プロジェクト構成

```
biodb-next/
├── docker/
│   └── postgres/          # PostgreSQL Docker設定
│       ├── Dockerfile
│       └── init.sql       # 初期化スクリプト（権限設定）
├── SQL/
│   ├── demo.sql          # demoデータベース（PDB、Protein）
│   └── setting.sql       # database1（業者、商品、発注、納入）
├── src/
│   ├── app/
│   │   ├── page.tsx      # トップページ
│   │   └── example/      # 演習用ページ
│   └── lib/
│       └── db.ts         # データベース接続設定
└── docker-compose.yml    # Docker Compose設定
```

## データベース情報

### 接続情報

- **ホスト**: `127.0.0.1` (localhost)
- **ポート**: `5432`
- **ユーザー**: `user`
- **パスワード**: `password`
- **データベース**: `demo` または `database1`

### データベース構成

#### demo データベース
- **PDB**: タンパク質構造データ
- **Protein**: タンパク質情報
- **PDB2Protein**: PDBとProteinの関連テーブル

#### database1 データベース
- **業者**: 取引業者情報
- **商品**: 商品マスタ
- **発注**: 発注履歴
- **納入**: 納入履歴

## よく使うコマンド

### Docker操作

```bash
# コンテナ起動
docker compose up -d

# コンテナ停止
docker compose down

# コンテナに接続（psqlを使う）
docker exec -it docker-postgres bash

# コンテナ内でpsql起動
psql -U user -d demo
```

### データベースリセット

SQLスクリプトは `DROP DATABASE IF EXISTS` を含むため、再実行すればデータベースがクリーンに作り直されます：

```bash
docker exec -i docker-postgres psql -U user -d postgres -f /home/user/SQL/demo.sql
```

## トラブルシューティング

### ポート5432が使用中

PostgreSQLが既にローカルで起動している場合は停止するか、docker-compose.ymlのポート番号を変更してください。

### データベース接続エラー

1. Docker コンテナが起動しているか確認: `docker ps`
2. 環境変数が正しいか確認: `.env.local` ファイルを作成し、以下を設定

```env
BIODB_DB_HOST=127.0.0.1
BIODB_DB_PORT=5432
BIODB_DB_USER=user
BIODB_DB_PASSWORD=password
BIODB_DB_NAME=demo
```

## 本番デプロイ（Neon等）

外部PostgreSQLサービス（Neon、Supabase等）へのデプロイ:

```bash
# 接続文字列を取得後
psql "postgresql://user:password@your-host.neon.tech/main" -f SQL/demo.sql
```

または

```bash
export DATABASE_URL="postgresql://user:password@your-host.neon.tech/main"
psql $DATABASE_URL -f SQL/demo.sql
```

## 技術スタック

- **フロントエンド**: Next.js 15 (App Router), React, TypeScript, Tailwind CSS
- **データベース**: PostgreSQL 17
- **開発環境**: Docker, Docker Compose
- **その他**: shadcn/ui (UIコンポーネント)

## ライセンス

演習用プロジェクト

