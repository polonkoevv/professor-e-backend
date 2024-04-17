class Product{
    product_id
    name
    price
    description
    preview
    images
    notes
    materials
    sizes

    constructor(product_id, name, price, description, preview, images, notes, materials, sizes){
        this.product_id = product_id
        this.name = name
        this.price = price
        this.description = description
        this.preview = preview
        this.images = images
        this.notes = notes
        this.materials = materials
        this.sizes = sizes
    }
}

export default Product
