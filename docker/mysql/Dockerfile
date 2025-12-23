FROM mysql:9.3.0

# 日本語環境構築
RUN microdnf update -y \
    && microdnf install -y glibc-langpack-ja \
    && microdnf clean all

# 環境変数の設定
ENV LANG=ja_JP.UTF-8
ENV LANGUAGE=ja_JP:ja
ENV LC_ALL=ja_JP.UTF-8

#mysqlのカスタム設定(windowsだと読み込み専用ファイルにしないといけないための措置)
COPY ./mycustom.cnf /etc/mysql/conf.d/mycustom.cnf
RUN chmod 644 /etc/mysql/conf.d/mycustom.cnf

#データベース操作権限持ったuser作成用のsqlを起動後に実行されるDirにコピー
COPY ./init.sql /docker-entrypoint-initdb.d/init.sql 

#log出力を設定すると起動時にエラーで落ちるための対策。
RUN rm -rf /var/log/mysql \
    && mkdir /var/log/mysql 
RUN chmod 777 /var/log/mysql

#初期の設定
ENV UNAME=user
ENV GNAME=user
RUN groupadd $GNAME \
    && useradd -m -s /bin/bash -g $GNAME $UNAME

WORKDIR /home/$UNAME/SQL
USER $UNAME

CMD ["mysqld", "--character-set-server=utf8mb4", "--collation-server=utf8mb4_unicode_ci"]