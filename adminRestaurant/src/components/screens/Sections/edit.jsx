import { useForm } from 'react-hook-form'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export function EditSectionDialog({ isOpen, onOpenChange, section }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: section.name,
      content: section.content || '',
    },
  });

  const onSubmit = (data) => {
    // Implement save logic here
    console.log('Saving section:', data)
    onOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Section</DialogTitle>
          <DialogDescription>
            Make changes to your section here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <input
              className="col-span-3"
              id="name"
              placeholder="Section name"
              {...register("name", { 
                required: "Name is required", 
                minLength: { value: 3, message: "Name must be at least 3 characters" }
              })}
            />
            {errors.name && <span className="text-red-500">{errors.name.message}</span>}
            <textarea
              className="col-span-3"
              id="content"
              placeholder="Section content"
              {...register("content")}
            />
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}