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
    id_listing INT REFERENCES Listing(id)
)

CREATE TABLE Permission (
    id SERIAL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT
);


CREATE TABLE QueueRegistration (
    id SERIAL PRIMARY KEY AUTO_INCREMENT,
    user_id INT REFERENCES User(id),
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE Role (
    id SERIAL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE RolePermission (
    role_id INT REFERENCES Role(id),
    permission_id INT REFERENCES Permission(id)
);


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
