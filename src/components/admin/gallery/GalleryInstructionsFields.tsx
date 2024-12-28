import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { GalleryFormValues } from "@/lib/validations/gallery";
import dynamic from '@vite/dynamic-import';

const Editor = dynamic(() => import('@/components/ui/editor'), {
  ssr: false,
  loading: () => <p>Loading editor...</p>
});

type GalleryInstructionsFieldsProps = {
  form: UseFormReturn<GalleryFormValues>;
};

export const GalleryInstructionsFields = ({ form }: GalleryInstructionsFieldsProps) => {
  const instructionsEnabled = form.watch("instructions_enabled");

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="instructions_enabled"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Enable Instructions</FormLabel>
              <FormDescription>
                Show instructions page after age verification
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />

      {instructionsEnabled && (
        <div className="space-y-4 rounded-lg border p-4 animate-in slide-in-from-top duration-300">
          <FormField
            control={form.control}
            name="instructions_content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Instructions Content</FormLabel>
                <FormControl>
                  <Editor
                    value={field.value || ''}
                    onChange={field.onChange}
                    className="min-h-[200px] border rounded-md"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="instructions_button_text"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enter Site Button Text</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter Site"
                    {...field}
                    value={field.value || 'Enter Site'}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      )}
    </div>
  );
};