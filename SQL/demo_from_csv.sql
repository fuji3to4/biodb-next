-- CSVインポート用スクリプト（PostgreSQL）
-- 前提: docker-compose により /home/user/SQL にCSVがマウントされています
-- 実行例（コンテナ内）: psql -U user -d postgres -f /home/user/SQL/import_from_csv.sql

-- デモDBへ接続
DROP DATABASE IF EXISTS demo;
CREATE DATABASE demo OWNER "user";

-- demoデータベースに接続
\connect demo

-- テーブルを作成する
CREATE TABLE PDB(
    PDBID CHAR(4) NOT NULL,
    method CHAR(20) NOT NULL,
    resolution FLOAT,
    chain CHAR(20) NOT NULL,
    positions CHAR(10) NOT NULL,
    deposited DATE NOT NULL,     -- date型という日付用の型。YYYY-MM-DD
    class CHAR(30),
    url TEXT,                    -- 長い文字列用にtext型。PostgreSQLではサイズ制限なし
    PRIMARY KEY(PDBID)           -- 主キー(primary key)の設定
);


CREATE TABLE Protein(
    proteinID SERIAL NOT NULL,   -- SERIAL（自動番号付け）。MySQLのAUTO_INCREMENTに相当
    name CHAR(50) NOT NULL,
    organism CHAR(30) NOT NULL,
    len INT NOT NULL,
    fav INT NOT NULL,
    PRIMARY KEY(proteinID)
);

CREATE TABLE PDB2Protein(
    PDBID CHAR(4) NOT NULL,
    proteinID INT NOT NULL,
    PRIMARY KEY(PDBID, proteinID)  -- 主キーが複合キーの場合キーとなる属性を並べる
);

-- PDB をCSVからインポート
COPY PDB (PDBID, method, resolution, chain, positions, deposited, class, url)
FROM '/home/user/SQL/PDB.csv'
DELIMITER ','
CSV HEADER
NULL 'null';

-- Protein をCSVからインポート
-- CSVに proteinID が含まれる場合は列を明示し、シーケンス値の調整も行います
COPY Protein (proteinID, name, organism, len, fav)
FROM '/home/user/SQL/Protein.csv'
DELIMITER ','
CSV HEADER
NULL 'null';


-- PDB2Protein をCSVからインポート
COPY PDB2Protein (PDBID, proteinID)
FROM '/home/user/SQL/PDB2Protein.csv'
DELIMITER ','
CSV HEADER
NULL 'null';
