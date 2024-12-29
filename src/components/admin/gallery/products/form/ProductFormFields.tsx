import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type ProductFormFieldsProps = {
  formData: {
    name: string;
    description: string;
    price: string;
    sku: string;
    category: string;
    stock_quantity: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

export const ProductFormFields = ({ formData, handleChange }: ProductFormFieldsProps) => {
  return (
    <>
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Name *
        </label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Description
        </label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      </div>
      
      <div>
        <label htmlFor="price" className="block text-sm font-medium mb-1">
          Price
        </label>
        <Input
          id="price"
          name="price"
          type="number"
          step="0.01"
          value={formData.price}
          onChange={handleChange}
        />
      </div>
      
      <div>
        <label htmlFor="sku" className="block text-sm font-medium mb-1">
          SKU
        </label>
        <Input
          id="sku"
          name="sku"
          value={formData.sku}
          onChange={handleChange}
        />
      </div>
      
      <div>
        <label htmlFor="category" className="block text-sm font-medium mb-1">
          Category
        </label>
        <Input
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
        />
      </div>
      
      <div>
        <label htmlFor="stock_quantity" className="block text-sm font-medium mb-1">
          Stock Quantity
        </label>
        <Input
          id="stock_quantity"
          name="stock_quantity"
          type="number"
          value={formData.stock_quantity}
          onChange={handleChange}
        />
      </div>
    </>
  );
};