# PHP 8.5 + FPM ベース
FROM php:8.5-fpm

# システム依存パッケージ
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    zip \
    unzip \
    default-mysql-client \
  && rm -rf /var/lib/apt/lists/*

# PHP拡張（Laravel + MySQL で必要なもの）
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

# Composer をマルチステージで取得
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# 作業ディレクトリ
WORKDIR /var/www/html

# ソースコードをコピー（開発時はボリュームマウントで上書きされる）
COPY . /var/www/html

# storage と bootstrap/cache の所有者を www-data に
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache \
  && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

EXPOSE 9000
CMD ["php-fpm"]
