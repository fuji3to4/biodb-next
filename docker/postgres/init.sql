-- PostgreSQL初期化スクリプト（演習用）
-- user ロールは公式イメージで自動作成されるため、ここでは権限の明示的設定のみ

-- user がスーパーユーザであることを明示的に確認（演習用）
-- 本番環境では権限を絞ることを推奨
ALTER ROLE "user" SUPERUSER CREATEROLE CREATEDB REPLICATION BYPASSRLS;

-- パブリックスキーマのデフォルト権限を演習用に設定
GRANT ALL ON SCHEMA public TO PUBLIC;
GRANT ALL ON SCHEMA public TO "user";
