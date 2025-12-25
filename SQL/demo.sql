-- PostgreSQL用のデモデータ（演習用）
-- データベースを毎回クリーンに作り直すスクリプト
-- 実行例: psql -U user -d postgres -f demo.sql

-- 既存のデータベースを削除して作り直し
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

CREATE TABLE Users(
    id SERIAL NOT NULL,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    PRIMARY KEY(id),
    UNIQUE(username)               -- usernameは一意制約(UNIQUE)を設定
);


INSERT INTO PDB VALUES
('1AGW','X-ray','2.40','A/B','456-765','1997-03-25','Enzyme','https://www.rcsb.org/structure/1AGW'),
('1CVS','X-ray','2.80','C/D','141-365','1999-08-24','Membrane','https://www.rcsb.org/structure/1CVS'),
('1A30','X-ray','2.00','A/B','489-587','1998-01-27','Enzyme','https://www.rcsb.org/structure/1A30'),
('1MBE','NMR',null,'A','38-89','1995-05-19','DNA-Binding','https://www.rcsb.org/structure/1MBE'),
('1GUU','X-ray','1.60','A','38-89','2002-01-30','DNA-Binding','https://www.rcsb.org/structure/1A30'),
('1LMB','X-ray','1.80','C/D','2-93','1991-11-05','DNA-Binding','https://www.rcsb.org/structure/1LMB'),
('4RWF','X-ray','1.76','A','31-116','2014-12-03','Membrane','https://www.rcsb.org/structure/4RWF'),
('2AMA','X-ray','1.90','A','655-920','2005-08-09','Signaling Protein','https://www.rcsb.org/structure/2AMA'),
('3EML','X-ray','2.60','A/B/C/D','1-297','2008-09-24','Membrene','https://www.rcsb.org/structure/3EML'),
('4HHB','X-ray','1.74','A/C','2-142','1984-03-07','Enzyme','https://www.rcsb.org/structure/4HHB'),
('5P21','X-ray','1.35','A','1-166','1990-10-15','Signaling Protein','https://www.rcsb.org/structure/5P21'),
('1UBQ','X-ray','1.80','A','1-76','1987-01-02','Protein Binding','https://www.rcsb.org/structure/1UBQ'),
('3LCK','X-ray','1.70','A','231-501','1997-04-08','Enzyme','https://www.rcsb.org/structure/3LCK'),
('2DN2','X-ray','1.25','A/C','2-142','2006-04-25','Enzyme','https://www.rcsb.org/structure/2DN2'),
('2XYZ','Electron Microscopy','4.00','A/B/C/D/E/F/G','1-430','2010-11-19','Enzyme','https://www.rcsb.org/structure/2XYZ'),
('3L3X','X-ray','1.55','A','671-919','2009-12-18','Signaling Protein','https://www.rcsb.org/structure/3L3X'),
('1IVO','X-ray','3.30','A/B','25-646','2002-03-28','Signaling Protein','https://www.rcsb.org/structure/1IVO'),
('1Z9I','NMR',null,'A','669-721','2005-04-02','Signaling Protein','https://www.rcsb.org/structure/1Z9I'),
('1M14','X-ray','2.60','A','695-1022','2002-06-17','Signaling Protein','https://www.rcsb.org/structure/1M14');

INSERT INTO Protein (proteinID, name, organism, len, fav) VALUES
('1','Fibroblast growth factor receptor 1','Human','822','0'),
('2','Gag-Pol polyprotein','HIV-1','1435','0'),
('3','Transcriptional activator Myb','Mouse','636','0'),
('4','Repressor protein cI','Bacteriophage lambda','237','0'),
('5','Calcitonin gene-related peptide type 1 receptor','Human','461','0'),
('6','Androgen receptor','Human','920','0'),
('7','Adenosine receptor A2a','Human','412','0'),
('8','Hemoglobin subunit alpha','Human','142','0'),
('9','GTPase HRas','Human','189','0'),
('10','Polyubiquitin-C','Human','685','0'),
('11','Tyrosine-protein kinase Lck','Human','509','0'),
('12','Zinc finger protein','Human','87','0'),
('13','Major capsid protein','Salmonella phage P22','430','0'),
('14','Epidermal growth factor receptor','Human','1210','0');

INSERT INTO PDB2Protein VALUES
('1AGW','1'),
('1CVS','1'),
('1A30','2'),
('1MBE','3'),
('1GUU','3'),
('1LMB','4'),
('4RWF','5'),
('2AMA','6'),
('3EML','7'),
('4HHB','8'),
('5P21','9'),
('1UBQ','10'),
('3LCK','11'),
('2DN2','8'),
('2XYZ','13'),
('3L3X','6'),
('1IVO','14'),
('1Z9I','14'),
('1M14','14');