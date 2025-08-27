import { IProduct } from "@/src/types";
import FormError from "../FormError";
import { createProduct, updateProduct } from "@/src/actions/product";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Modal from "../Modal";
import InputContainer from "../InputContainer";
import Button from "../Button";
import { Plus, Save } from "lucide-react";
import { z } from "zod";
import { validateInput } from "@/src/utils";

// Zod schema for product validation
const productSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    unitPrice: z.number().min(0, "Unit price must be greater than or equal to 0"),
    sku: z.string().min(1, "SKU is required"),
    quantity: z.number().min(0, "Quantity must be greater than or equal to 0"),
    category: z.string().min(1, "Category is required"),
    reorderLevel: z.number().min(0, "Reorder level must be greater than or equal to 0"),
    reorderQuantity: z.number().min(0, "Reorder quantity must be greater than or equal to 0"),
    sellingPrice: z.number().min(0, "Selling price must be greater than or equal to 0"),
    brand: z.string().min(1, "Brand is required"),
});

export default function CreateProduct({ open, setOpen, user }: { open: boolean, setOpen: Dispatch<SetStateAction<boolean>>, user?: IProduct }) {
    const [product, setProduct] = useState<IProduct>({
        title: '',
        description: '',
        unitPrice: 0,
        sku: '',
        quantity: 0,
        category: '',
        reorderLevel: 0,
        reorderQuantity: 0,
        sellingPrice: 0,
        brand: '',
        attachments: [],
        supplier: [],
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initialize form with user data if editing
    useEffect(() => {
        if (user) {
            setProduct(user);
        } else {
            setProduct({
                title: '',
                description: '',
                unitPrice: 0,
                sku: '',
                quantity: 0,
                category: '',
                reorderLevel: 0,
                reorderQuantity: 0,
                sellingPrice: 0,
                brand: '',
                attachments: [],
                supplier: [],
            });
        }
        setErrors({});
        setSuccessMessage(null);
    }, [user, open]);

    const validateFormInput = (): boolean => {
        const { isValid, errors: validationErrors } = validateInput<IProduct>(productSchema, product);
        if (!isValid) {
            setErrors(validationErrors);
            return false;
        }
        setErrors({});
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateFormInput()) return;

        setIsSubmitting(true);
        try {
            let response;
            if (user?.id) {
                // Update existing product
                response = await updateProduct(user.id, product);
            } else {
                // Create new product
                response = await createProduct(product);
            }

            if (response.success) {
                const message = user?.id ? "Product updated successfully!" : "Product created successfully!";
                setSuccessMessage(message);

                if (!user?.id) {
                    // Reset form only for new products
                    setProduct({
                        title: '',
                        description: '',
                        unitPrice: 0,
                        sku: '',
                        quantity: 0,
                        category: '',
                        reorderLevel: 0,
                        reorderQuantity: 0,
                        sellingPrice: 0,
                        brand: '',
                        attachments: [],
                        supplier: [],
                    });
                }

                setTimeout(() => {
                    setSuccessMessage(null);
                    setOpen(false);
                }, 2000);
            } else {
                setErrors({ general: response.error || "Failed to save product" });
            }
        } catch (err) {
            setErrors({ general: "An unexpected error occurred" });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (field: keyof IProduct, value: string | number) => {
        setProduct(prev => ({ ...prev, [field]: value }));
        // Clear error for this field when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    return (
        <Modal open={open} setOpen={setOpen} title={user ? 'Edit Product Details' : 'Add New Product'}>
            <form className={`flex flex-col gap-4`} onSubmit={handleSubmit}>
                {errors.general && <FormError err={errors.general} />}
                {successMessage && (
                    <div className="py-2 px-4 bg-green-50 text-green-500 border border-green-200 rounded-md transition-all duration-300">
                        {successMessage}
                    </div>
                )}

                <InputContainer
                    label="Title"
                    value={product.title}
                    setValue={(text: string | number) => handleInputChange('title', text)}
                    placeholder="Enter product title"
                    err={errors.title}
                />
                <InputContainer
                    label="Description"
                    value={product.description}
                    setValue={(text: string | number) => handleInputChange('description', text)}
                    placeholder="Enter product description"
                    err={errors.description}
                />
                <InputContainer
                    label="Unit Price"
                    value={product.unitPrice}
                    setValue={(text: string | number) => handleInputChange('unitPrice', Number(text))}
                    placeholder="Enter unit price"
                    type="number"
                    err={errors.unitPrice}
                />
                <InputContainer
                    label="SKU"
                    value={product.sku}
                    setValue={(text: string | number) => handleInputChange('sku', text)}
                    placeholder="Enter SKU"
                    err={errors.sku}
                />
                <InputContainer
                    label="Quantity"
                    value={product.quantity}
                    setValue={(text: string | number) => handleInputChange('quantity', Number(text))}
                    placeholder="Enter quantity"
                    type="number"
                    err={errors.quantity}
                />
                <InputContainer
                    label="Category"
                    value={product.category}
                    setValue={(text: string | number) => handleInputChange('category', text)}
                    placeholder="Enter category"
                    err={errors.category}
                />
                <InputContainer
                    label="Reorder Level"
                    value={product.reorderLevel}
                    setValue={(text: string | number) => handleInputChange('reorderLevel', Number(text))}
                    placeholder="Enter reorder level"
                    type="number"
                    err={errors.reorderLevel}
                    helperText="What do you consider as low stock?"
                />
                <InputContainer
                    label="Reorder Quantity"
                    value={product.reorderQuantity}
                    setValue={(text: string | number) => handleInputChange('reorderQuantity', Number(text))}
                    placeholder="Enter reorder quantity"
                    type="number"
                    err={errors.reorderQuantity}
                    helperText="How many do you buy per restock?"
                />
                <InputContainer
                    label="Selling Price"
                    value={product.sellingPrice}
                    setValue={(text: string | number) => handleInputChange('sellingPrice', Number(text))}
                    placeholder="Enter selling price"
                    type="number"
                    err={errors.sellingPrice}
                />
                <InputContainer
                    label="Brand"
                    value={product.brand}
                    setValue={(text: string | number) => handleInputChange('brand', text)}
                    placeholder="Enter brand"
                    err={errors.brand}
                />
                <Button
                    text={isSubmitting ? "Saving..." : user ? "Update Product" : "Add Product"}
                    icon={isSubmitting ? <Plus size={10} color="#fff" /> : user ? <Save size={10} color="#fff" /> : <Plus size={10} color="#fff" />}
                    type={isSubmitting ? "secondary" : "default"}
                    classNames={isSubmitting ? "opacity-50 cursor-not-allowed" : ""}
                />
            </form>
        </Modal>
    )
}
