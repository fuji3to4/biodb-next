# 認証機能（NextAuth + Credentials + PostgreSQL）サンプル

## 1. ログインデモURL

以下の URL にアクセスすると、ログイン／会員登録画面を確認できる。

http://localhost:3000/example/auth

## 2. 必須データベース構成

### 2.1 Users テーブル

ログインを実装したい場合、最低でも以下のUsers（ログインIDとパスワードハッシュ値を保持しておく）テーブルが必須。

```sql
CREATE TABLE Users(
id SERIAL NOT NULL,
username VARCHAR(255) NOT NULL,
password VARCHAR(255) NOT NULL,
PRIMARY KEY(id),
UNIQUE(username) -- usernameは一意制約(UNIQUE)を設定
);
```

## 3. 環境変数設定（必須）

### 3.1 .env / .env.local の作成

プロジェクトルートに .envを作成し、以下を追記する。

```env
NEXTAUTH_SECRET=your-super-secret-string
```
### 3.2 NEXTAUTH_SECRET の生成方法

#### 推奨（openssl が使える場合）

```bash
openssl rand -base64 32
```

出力された文字列を your-super-secret-string に設定する。

#### 代替手段（openssl が使えない場合）

- ランダムな英数字＋記号を十分な長さで生成する