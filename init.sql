

CREATE TABLE material(
    material_id integer primary key auto_increment,
    name varchar(256) not null
);

CREATE TABLE size(
    size_id integer primary key auto_increment,
    name varchar(256) not null
);

CREATE TABLE image(
    image_id integer not null  auto_increment primary key,
    path varchar(256) not null
);

CREATE TABLE product(
    product_id integer primary key auto_increment,
    name varchar(256) not null,
    price integer not null,
    description text not null,
    preview_id integer not null,
    CONSTRAINT ref_prod_preview FOREIGN KEY (preview_id) 
    REFERENCES image(image_id)
);



CREATE TABLE note(
    note_id integer not null  auto_increment,
    product_id integer not null,
    text varchar(256) not null,

    CONSTRAINT ref_note_prod FOREIGN KEY (product_id)
    REFERENCES product(product_id),

    PRIMARY KEY(note_id, product_id)
);

CREATE TABLE product_to_image(
    product_id integer not null,
    image_id integer not null,

    CONSTRAINT ref_prod_prod_image FOREIGN KEY (product_id)
    REFERENCES product(product_id),

    CONSTRAINT ref_image_image FOREIGN KEY (image_id)
    REFERENCES image(image_id),

    PRIMARY KEY(product_id, image_id)
);

CREATE TABLE product_to_size(
    product_id integer not null,
    size_id integer not null,

    CONSTRAINT ref_prod_pr FOREIGN KEY (product_id)
    REFERENCES product(product_id),

    CONSTRAINT ref_size_size FOREIGN KEY (size_id)
    REFERENCES size(size_id),

    PRIMARY KEY(product_id, size_id)
);


CREATE TABLE product_to_material(
    product_id integer not null,
    material_id integer not null,

    CONSTRAINT ref_prod_prod_material FOREIGN KEY (product_id)
    REFERENCES product(product_id),

    CONSTRAINT ref_mat_mat FOREIGN KEY (material_id)
    REFERENCES material(material_id),

    PRIMARY KEY(product_id, material_id)
);
