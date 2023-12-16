-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1

-- Waktu pembuatan: 15 Des 2023 pada 07.22

-- Versi server: 10.4.25-MariaDB
-- Versi PHP: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- --------------------------------------------------------

--
-- Struktur dari tabel `animals`
--

CREATE TABLE `animals` (
  `animal_id` int(11) NOT NULL,
  `animal_title` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `animals`
--

INSERT INTO `animals` (`animal_id`, `animal_title`) VALUES
(1, 'Kuda'),
(2, 'Sapi'),
(3, 'Kelinci'),
(4, 'Ayam');

-- --------------------------------------------------------

--
-- Struktur dari tabel `brands`
--

CREATE TABLE `brands` (
  `brand_id` int(100) NOT NULL,
  `brand_title` text NOT NULL,
  `user_id` int(100) NOT NULL,
  `location` text NOT NULL,
  `brand_image` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `brands`
--

INSERT INTO `brands` (`brand_id`, `brand_title`, `user_id`, `location`, `brand_image`) VALUES
(6, 'Peternakan A247BSY2543', 21, '000, 000, 000', ''),
(7, 'Peternakan C216BSY3194', 20, '000, 000, 000', '');

-- --------------------------------------------------------

--
-- Struktur dari tabel `cart`
--

CREATE TABLE `cart` (
  `cart_id` int(10) NOT NULL,
  `product_id` int(10) NOT NULL,
  `ip_add` varchar(250) NOT NULL,
  `user_id` int(10) NOT NULL,
  `qty` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `cart`
--

INSERT INTO `cart` (`cart_id`, `product_id`, `ip_add`, `user_id`, `qty`) VALUES
(12, 11, '1000000', 16, 10);

-- --------------------------------------------------------

--
-- Struktur dari tabel `categories`
--

CREATE TABLE `categories` (
  `cat_id` int(100) NOT NULL,
  `cat_title` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `categories`
--

INSERT INTO `categories` (`cat_id`, `cat_title`) VALUES
(1, 'Ternak Besar'),
(2, 'Ternak Sedang'),
(3, 'Ternak Kecil'),
(4, 'Unggas'),
(5, 'Lainnya');

-- --------------------------------------------------------

--
-- Struktur dari tabel `orders`
--

CREATE TABLE `orders` (
  `order_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `qty` int(11) NOT NULL,
  `transfer_id` varchar(255) NOT NULL,
  `p_status` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `orders`
--

INSERT INTO `orders` (`order_id`, `user_id`, `product_id`, `qty`, `transfer_id`, `p_status`) VALUES
(6, 16, 8, 1, '1000000', 'Done'),
(7, 16, 10, 10, '1000000', 'Pending');

-- --------------------------------------------------------

--
-- Struktur dari tabel `products`
--

CREATE TABLE `products` (
  `product_id` int(100) NOT NULL,
  `product_cat` int(100) NOT NULL,
  `product_brand` int(100) NOT NULL,
  `product_title` varchar(255) NOT NULL,
  `product_price` int(100) NOT NULL,
  `product_desc` text NOT NULL,
  `product_image` text NOT NULL,
  `product_keywords` text NOT NULL,
  `stock` int(100) NOT NULL,
  `sales` int(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `products`
--

INSERT INTO `products` (`product_id`, `product_cat`, `product_brand`, `product_title`, `product_price`, `product_desc`, `product_image`, `product_keywords`, `stock`, `sales`) VALUES
(8, 1, 6, 'Sapi Legion', 125000000, 'Sapi ini memiliki spesifikasi Ram 32 GB dengan Memori SSD 64GB So-DIM, Layar OLED 100% SRGB VGA Nvidia RTX 8080ti', '', '', 20, 0),
(9, 3, 6, 'Kelinci Gunung', 200000, 'Kelinci ini cocok dijadikan hewan ternak bagi yang tinggal dipegunungan yang sejuk', '', '', 50, 0),
(10, 3, 6, 'Kelinci Alaska', 250000, 'Kelinci ini memiliki ukuran yang lebih besar daripada kelinci pada umumnya', '', '', 30, 0),
(11, 4, 7, 'Ayam Petelur', 125000, 'Ayam ini dapat menghasilkan 5 telur perhari jika diberi pertamax', '', '', 130, 0),
(12, 4, 7, 'Ayam Buff Orpington', 100000, 'Ayam petelur Buff Orpington merupakan jenis ayam petelur yang juga berasal dari Inggris. Ayam ini jinak dan acapkali tidak memerlukan sebuah tempat berternak khusus. Artinya, ayam ini bisa dibiarkan untuk tinggal di halaman.', '', '', 100, 0),
(13, 2, 7, 'Kambing Gunung', 1400000, 'Dari namanya udah jelas bwang', '', '', 40, 0),
(14, 5, 7, 'Lebah Madu', 1000000, 'Dapat diberi per box sarang', '', '', 25, 0);

-- --------------------------------------------------------

--
-- Struktur dari tabel `review`
--

CREATE TABLE `review` (
  `review_id` int(11) NOT NULL,
  `user_id` int(100) NOT NULL,
  `brand_id` int(100) NOT NULL,
  `product_id` int(100) NOT NULL,
  `rate` int(10) NOT NULL,
  `comment` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `review`
--

INSERT INTO `review` (`review_id`, `user_id`, `brand_id`, `product_id`, `rate`, `comment`) VALUES
(5, 16, 6, 8, 5, 'Mantap bang, packagingnnya bagus, barang sampai dengan baik dan benar'),
(6, 18, 6, 8, 5, 'Barang sampai dengan aman, layanan kelewat ramah');

-- --------------------------------------------------------

--
-- Struktur dari tabel `user_info`
--

CREATE TABLE `user_info` (
  `user_id` int(10) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(300) NOT NULL,
  `username` varchar(300) NOT NULL,
  `password` varchar(300) NOT NULL,
  `address1` varchar(300) NOT NULL,
  `address2` varchar(11) NOT NULL,
  `isAdmin` tinyint(1) NOT NULL,
  `location` text NOT NULL,
  `no_rek` varchar(100) NOT NULL,
  `user_image` text NOT NULL,
  `cat_id` int(10) NOT NULL,
  `animal_id1` int(10) NOT NULL,
  `animal_id2` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `user_info`
--

INSERT INTO `user_info` (`user_id`, `first_name`, `last_name`, `email`, `username`, `password`, `address1`, `address2`, `isAdmin`, `location`, `no_rek`, `user_image`, `cat_id`, `animal_id1`, `animal_id2`) VALUES
(1, '', '', 'admin@beternak.com', 'admin', '$2b$10$okiykhGzZz3FSzyu.TU6fuhNoF7GW77FcWOOQb57vuuRBha2.VkUa', '', '', 1, '', '', '', 1, 1, 2),
(16, '', '', 'M216BSY1845@beternak.com', 'M216BSY1845', '$2b$10$21Ume/QRImvS/Cw0jt7iiu0E52N88s5DASvB1ayLnqmgI0rUNla/G', '', '', 0, '', '', '', 1, 1, 2),
(17, '', '', 'M247BSY0380@beternak.com', 'M247BSY0380', '$2b$10$X.cAGDgRpJc5MA1tc6rf7epxi.jUcD4F3yc9HDx5F77SF/Wwdj1Lq', '', '', 0, '', '', '', 1, 1, 2),
(18, '', '', 'M491BSY0864@beternak.com', 'M491BSY0864', '$2b$10$.1sGhvgys7nsbeFhnoZaVOvyVOCxGMyQNAciVRbLFoxDLrjdkaiXa', '', '', 0, '', '', '', 1, 1, 2),
(19, '', '', 'C247BSY3737@beternak.com', 'C247BSY3737', '$2b$10$s1Q.nnITjoh1hDv9UQ2ymOoA7OSUm3rEizpyc4.ZR9OWI0/eHGqP6', '', '', 0, '', '', '', 1, 1, 2),
(20, '', '', 'C216BSY3194@beternak.com', 'C216BSY3194', '$2b$10$aytSx8BviM969Aetn/HBOehLiPPP1BaNyTSfwhqWUUDVEsVNWRx36', '', '', 0, '', '', '', 1, 1, 2),
(21, '', '', 'A247BSY2543@beternak.com', 'A247BSY2543', '$2b$10$j2KsBDKBCMfOItXjR9rh3OLFT2R8hi63uqYxybRRlBZlWyXWI3HAW', '', '', 0, '', '', '', 1, 1, 2);

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `animals`
--
ALTER TABLE `animals`
  ADD PRIMARY KEY (`animal_id`);

--
-- Indeks untuk tabel `brands`
--
ALTER TABLE `brands`
  ADD PRIMARY KEY (`brand_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indeks untuk tabel `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`cart_id`),
  ADD KEY `product_id_2` (`product_id`,`user_id`,`qty`),
  ADD KEY `user_id` (`user_id`) USING BTREE,
  ADD KEY `product_id` (`product_id`) USING BTREE;

--
-- Indeks untuk tabel `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`cat_id`);

--
-- Indeks untuk tabel `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_id`),
  ADD UNIQUE KEY `user_id` (`user_id`,`product_id`,`qty`),
  ADD KEY `qty` (`qty`),
  ADD KEY `user_id_2` (`user_id`,`product_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indeks untuk tabel `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`product_id`),
  ADD KEY `product_brand` (`product_brand`),
  ADD KEY `product_cat` (`product_cat`,`product_brand`) USING BTREE;

--
-- Indeks untuk tabel `review`
--
ALTER TABLE `review`
  ADD PRIMARY KEY (`review_id`),
  ADD KEY `user_id` (`user_id`,`brand_id`,`product_id`),
  ADD KEY `brand_id` (`brand_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indeks untuk tabel `user_info`
--
ALTER TABLE `user_info`
  ADD PRIMARY KEY (`user_id`),
  ADD KEY `cat_id` (`cat_id`,`animal_id1`,`animal_id2`),
  ADD KEY `animal_id1` (`animal_id1`),
  ADD KEY `animal_id2` (`animal_id2`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `animals`
--
ALTER TABLE `animals`
  MODIFY `animal_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT untuk tabel `brands`
--
ALTER TABLE `brands`
  MODIFY `brand_id` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT untuk tabel `cart`
--
ALTER TABLE `cart`
  MODIFY `cart_id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT untuk tabel `categories`
--
ALTER TABLE `categories`
  MODIFY `cat_id` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT untuk tabel `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT untuk tabel `products`
--
ALTER TABLE `products`
  MODIFY `product_id` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT untuk tabel `review`
--
ALTER TABLE `review`
  MODIFY `review_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT untuk tabel `user_info`
--
ALTER TABLE `user_info`
  MODIFY `user_id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `brands`
--
ALTER TABLE `brands`
  ADD CONSTRAINT `brands_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user_info` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `cart`
--
ALTER TABLE `cart`
  ADD CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user_info` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `cart_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user_info` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`product_brand`) REFERENCES `brands` (`brand_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `products_ibfk_2` FOREIGN KEY (`product_cat`) REFERENCES `categories` (`cat_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `review`
--
ALTER TABLE `review`
  ADD CONSTRAINT `review_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user_info` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `review_ibfk_2` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`brand_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `review_ibfk_3` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `user_info`
--
ALTER TABLE `user_info`
  ADD CONSTRAINT `user_info_ibfk_1` FOREIGN KEY (`cat_id`) REFERENCES `categories` (`cat_id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `user_info_ibfk_2` FOREIGN KEY (`animal_id1`) REFERENCES `animals` (`animal_id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `user_info_ibfk_3` FOREIGN KEY (`animal_id2`) REFERENCES `animals` (`animal_id`) ON DELETE NO ACTION ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
