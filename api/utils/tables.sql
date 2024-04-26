CREATE TABLE Listing (
    id SERIAL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    address VARCHAR(255) NOT NULL,
    gender VARCHAR(255) NOT NULL,
    allergies VARCHAR(255),
    illness VARCHAR(255),
    auto VARCHAR(255),
    public_service VARCHAR(255) NOT NULL,
    animals VARCHAR(255),
    regular_price DECIMAL,
    discount_price DECIMAL,
    bathrooms INT NOT NULL,
    bedrooms INT NOT NULL,
    furnished BOOLEAN NOT NULL,
    parking BOOLEAN NOT NULL,
    type VARCHAR(255) NOT NULL,
    wifi BOOLEAN NOT NULL,    
    details VARCHAR(255),
    availability BOOLEAN,
    availability_date_start_from TIMESTAMP NOT NULL,
    availability_date_end_on TIMESTAMP NOT NULL,
    sleep_place INT NOT NULL,
    user_ref VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ListingUrls (
    id SERIAL PRIMARY KEY AUTO_INCREMENT,
    url VARCHAR(500),
    fk_id_listing BIGINT UNSIGNED NOT NULL,
    FOREIGN KEY(fk_id_listing)  REFERENCES Listing(id)
)


CREATE TABLE User (
    id SERIAL PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    avatar VARCHAR(255) DEFAULT 'https://freesvg.org/img/abstract-user-flat-4.png',
    role_id INT REFERENCES Role(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE Permission (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT
);


CREATE TABLE Role (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE RolePermission (
    id SERIAL PRIMARY KEY AUTO_INCREMENT,
    fk_role_id BIGINT NOT NULL,
    fk_permission_id BIGINT NOT NULL,
    FOREIGN KEY (fk_role_id) REFERENCES Role(id),
    FOREIGN KEY (fk_permission_id) REFERENCES Permission(id)
);

CREATE TABLE QueueRegistration (
    id SERIAL PRIMARY KEY AUTO_INCREMENT,
    fk_user_id BIGINT UNSIGNED NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (fk_user_id) REFERENCES User(id)
);


CREATE TABLE QueueListing (
    id SERIAL PRIMARY KEY AUTO_INCREMENT,
    fk_user_id BIGINT UNSIGNED NOT NULL,
    fk_listing_id BIGINT UNSIGNED NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (fk_user_id) REFERENCES User(id),
    FOREIGN KEY (fk_listing_id) REFERENCES Listing(id)
);