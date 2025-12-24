FROM postgres:17

# 日本語環境構築
RUN apt-get update \
    && apt-get install -y locales \
    && sed -i -e 's/# ja_JP.UTF-8 UTF-8/ja_JP.UTF-8 UTF-8/' /etc/locale.gen \
    && locale-gen \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# 環境変数の設定
ENV LANG=ja_JP.UTF-8
ENV LANGUAGE=ja_JP:ja
ENV LC_ALL=ja_JP.UTF-8

# 初期化SQLをコピー
COPY ./init.sql /docker-entrypoint-initdb.d/01-init.sql

# コンテナログイン時の初期ディレクトリ
WORKDIR /home/user/SQL
