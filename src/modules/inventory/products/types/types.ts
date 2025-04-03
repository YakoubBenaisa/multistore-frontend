
export interface Product{
    
        id: string,
        store_id: string,
        name: string,
        description: string,
        price: number,
        category_id: string | null,
        inventory_count: number,
        images: string[],
        created_at: Date,
        updated_at: Date,
        category: string | null
    
}
export interface ProductResponse{
 success: boolean
 data?: Product 
}  