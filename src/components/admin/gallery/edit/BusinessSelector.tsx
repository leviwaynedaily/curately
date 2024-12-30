import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

type Business = {
  id: string;
  name: string;
};

type BusinessSelectorProps = {
  businesses: Business[];
  selectedBusinessId: string | null;
  onBusinessSelect: (businessId: string) => void;
  onContinue: () => void;
};

export const BusinessSelector = ({
  businesses,
  selectedBusinessId,
  onBusinessSelect,
  onContinue,
}: BusinessSelectorProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Select a Business</h2>
      <div className="max-w-md">
        <Select
          value={selectedBusinessId || ""}
          onValueChange={(value) => onBusinessSelect(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a business" />
          </SelectTrigger>
          <SelectContent>
            {businesses?.map((business) => (
              <SelectItem key={business.id} value={business.id}>
                {business.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button 
        onClick={onContinue}
        disabled={!selectedBusinessId || !businesses?.length}
      >
        Continue
      </Button>
    </div>
  );
};