SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS card_value_record;
DROP TABLE IF EXISTS point_record;
DROP TABLE IF EXISTS match_guess;
DROP TABLE IF EXISTS worldcup_match;
DROP TABLE IF EXISTS player_card;
DROP TABLE IF EXISTS player;
DROP TABLE IF EXISTS user_info;
DROP TABLE IF EXISTS national_team;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE national_team (
  team_id INT PRIMARY KEY AUTO_INCREMENT,
  team_name VARCHAR(80) NOT NULL UNIQUE,
  country_code CHAR(3) NOT NULL UNIQUE,
  flag_url VARCHAR(255),
  fifa_rank INT NULL,
  group_name VARCHAR(20) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE user_info (
  user_id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL UNIQUE,
  nickname VARCHAR(80) NOT NULL,
  total_points INT NOT NULL DEFAULT 0,
  favorite_team_id INT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_user_favorite_team
    FOREIGN KEY (favorite_team_id) REFERENCES national_team(team_id)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE player (
  player_id INT PRIMARY KEY AUTO_INCREMENT,
  player_name VARCHAR(100) NOT NULL,
  team_id INT NOT NULL,
  position ENUM('GK','DF','MF','FW') NOT NULL,
  age INT NOT NULL,
  club VARCHAR(100) NOT NULL,
  market_value DECIMAL(12,2) NOT NULL DEFAULT 0,
  photo_url VARCHAR(255),
  is_in_squad BOOLEAN NOT NULL DEFAULT TRUE,
  CONSTRAINT fk_player_team
    FOREIGN KEY (team_id) REFERENCES national_team(team_id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE player_card (
  card_id INT PRIMARY KEY AUTO_INCREMENT,
  player_id INT NOT NULL,
  card_name VARCHAR(140) NOT NULL,
  card_type ENUM('Standard','Featured','Epic','Highlight') NOT NULL,
  rarity VARCHAR(40) NOT NULL,
  base_rating INT NOT NULL,
  current_rating INT NOT NULL,
  current_value DECIMAL(12,2) NOT NULL,
  status ENUM('normal','rising','falling') NOT NULL DEFAULT 'normal',
  CONSTRAINT fk_card_player
    FOREIGN KEY (player_id) REFERENCES player(player_id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT chk_card_rating CHECK (base_rating BETWEEN 1 AND 100 AND current_rating BETWEEN 1 AND 100),
  CONSTRAINT chk_card_value CHECK (current_value >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE worldcup_match (
  match_id INT PRIMARY KEY AUTO_INCREMENT,
  home_team_id INT NOT NULL,
  away_team_id INT NOT NULL,
  match_time DATETIME NOT NULL,
  stage VARCHAR(80) NOT NULL,
  home_score INT NULL,
  away_score INT NULL,
  status ENUM('upcoming','finished','canceled') NOT NULL DEFAULT 'upcoming',
  CONSTRAINT fk_match_home_team
    FOREIGN KEY (home_team_id) REFERENCES national_team(team_id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_match_away_team
    FOREIGN KEY (away_team_id) REFERENCES national_team(team_id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT chk_match_score CHECK (
    (home_score IS NULL OR home_score >= 0) AND
    (away_score IS NULL OR away_score >= 0)
  )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE match_guess (
  guess_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  match_id INT NOT NULL,
  guess_result ENUM('home','draw','away') NOT NULL,
  guess_home_score INT NOT NULL,
  guess_away_score INT NOT NULL,
  is_correct BOOLEAN NULL,
  points_awarded INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_guess_user_match (user_id, match_id),
  CONSTRAINT fk_guess_user
    FOREIGN KEY (user_id) REFERENCES user_info(user_id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_guess_match
    FOREIGN KEY (match_id) REFERENCES worldcup_match(match_id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT chk_guess_score CHECK (guess_home_score >= 0 AND guess_away_score >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE point_record (
  record_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  match_id INT NOT NULL,
  points_change INT NOT NULL,
  reason VARCHAR(200) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_point_user
    FOREIGN KEY (user_id) REFERENCES user_info(user_id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_point_match
    FOREIGN KEY (match_id) REFERENCES worldcup_match(match_id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE card_value_record (
  value_record_id INT PRIMARY KEY AUTO_INCREMENT,
  card_id INT NOT NULL,
  match_id INT NULL,
  old_value DECIMAL(12,2) NOT NULL,
  new_value DECIMAL(12,2) NOT NULL,
  change_reason ENUM('goal','assist','clean_sheet','poor_performance','star_pick','market_adjustment') NOT NULL,
  changed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_value_card
    FOREIGN KEY (card_id) REFERENCES player_card(card_id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_value_match
    FOREIGN KEY (match_id) REFERENCES worldcup_match(match_id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT chk_value_nonnegative CHECK (old_value >= 0 AND new_value >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
