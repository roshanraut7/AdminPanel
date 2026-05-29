"use client";

import { useState } from "react";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useForm } from "react-hook-form";
import { LoaderCircle, Plus } from "lucide-react";
import { toast } from "sonner";

import { useCreateCategoryMutation } from "@/lib/redux/services/category-api";
import {
  createCategorySchema,
  type CreateCategoryFormValues,
} from "@/validations/category.schema";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function getApiErrorMessage(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "data" in error
  ) {
    const responseData = (
      error as {
        data?: {
          message?: string | string[];
        };
      }
    ).data;

    if (Array.isArray(responseData?.message)) {
      return responseData.message.join(", ");
    }

    if (typeof responseData?.message === "string") {
      return responseData.message;
    }
  }

  return "Unable to create category. Please try again.";
}
interface AddCategoryFormProps {
  onCreated?: () => void;
}

export function AddCategoryForm({
    onCreated,
}: AddCategoryFormProps
) {
  const [open, setOpen] = useState(false);

  const [createCategory, { isLoading }] =
    useCreateCategoryMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
    },
  } = useForm<CreateCategoryFormValues>({
    resolver: standardSchemaResolver(createCategorySchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const handleOpenChange = (nextOpen: boolean) => {
    if (isLoading) {
      return;
    }

    setOpen(nextOpen);

    if (!nextOpen) {
      reset();
    }
  };

 const onSubmit = async (values: CreateCategoryFormValues) => {
  try {
    await createCategory({
      name: values.name,
      description: values.description || undefined,
    }).unwrap();

    toast.success("Category created successfully.");

    reset();
    setOpen(false);

    /**
     * Tells the category page to return to page 1
     * and show newest categories first.
     */
    onCreated?.();
  } catch (error) {
    toast.error(getApiErrorMessage(error));
  }
};
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="h-10 bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="mr-2 size-4" />
          Add Category
        </Button>
      </DialogTrigger>

      <DialogContent
        className="border-border bg-card text-card-foreground sm:max-w-[480px]"
        onInteractOutside={(event) => {
          if (isLoading) {
            event.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-foreground">
            Add Category
          </DialogTitle>

          <DialogDescription className="text-muted-foreground">
            Create a new category for organising communities.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-5 pt-3"
        >
          <div className="space-y-2">
            <Label
              htmlFor="category-name"
              className="text-sm font-medium text-foreground"
            >
              Category name
            </Label>

            <Input
              id="category-name"
              type="text"
              placeholder="For example: Food and Dining"
              disabled={isLoading}
              aria-invalid={Boolean(errors.name)}
              {...register("name")}
              className="h-11 border-input bg-background"
            />

            {errors.name?.message && (
              <p className="text-sm text-destructive">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <Label
                htmlFor="category-description"
                className="text-sm font-medium text-foreground"
              >
                Description
              </Label>

              <span className="text-xs text-muted-foreground">
                Optional
              </span>
            </div>

            <Textarea
              id="category-description"
              placeholder="Write a short description of this category."
              disabled={isLoading}
              aria-invalid={Boolean(errors.description)}
              {...register("description")}
              className="min-h-28 resize-none border-input bg-background"
            />

            {errors.description?.message && (
              <p className="text-sm text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          <DialogFooter className="gap-2 pt-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              disabled={isLoading}
              onClick={() => handleOpenChange(false)}
              className="border-border bg-background hover:bg-muted"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isLoading}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isLoading && (
                <LoaderCircle className="mr-2 size-4 animate-spin" />
              )}

              {isLoading ? "Creating..." : "Create Category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}