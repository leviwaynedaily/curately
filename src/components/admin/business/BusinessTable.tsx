import { Table, TableBody } from "@/components/ui/table";
import { BusinessTableHeader } from "./BusinessTableHeader";
import { BusinessTableRow } from "./BusinessTableRow";

type BusinessTableProps = {
  businesses: any[];
  onEdit: (business: any) => void;
  onDelete: (business: any) => void;
};

export const BusinessTable = ({
  businesses,
  onEdit,
  onDelete,
}: BusinessTableProps) => {
  return (
    <Table>
      <BusinessTableHeader />
      <TableBody>
        {businesses?.map((business) => (
          <BusinessTableRow
            key={business.id}
            business={business}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </TableBody>
    </Table>
  );
};