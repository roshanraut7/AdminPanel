"use client";

import { useState } from "react";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useForm } from "react-hook-form";
import { LoaderCircle, Plus } from "lucide-react";
import { toast } from "sonner";

import { useGetCategoriesQuery } from "@/lib/redux/services/category-api";
import { useCreateCommunityMutation } from "@/lib/redux/services/community-api";
import {
  createCommunitySchema,
  type CreateCommunityFormValues,
} from "@/validations/community.schema";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface AddCommunityFormProps {
  onCreated?: () => void;
}

function getApiErrorMessage(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "data" in error
  ) {
    const data = (
      error as {
        data?: {
          message?: string | string[];
        };
      }
    ).data;

    if (Array.isArray(data?.message)) {
      return data.message.join(", ");
    }

    if (typeof data?.message === "string") {
      return data.message;
    }
  }

  return "Unable to create community. Please try again.";
}

export function AddCommunityForm({
  onCreated,
}: AddCommunityFormProps) {
  const [open, setOpen] = useState(false);

  const [createCommunity, { isLoading: isCreating }] =
    useCreateCommunityMutation();

  const {
    data: categoryResponse,
    isLoading: isLoadingCategories,
    isError: isCategoryError,
  } = useGetCategoriesQuery({
    page: 1,
    limit: 50,
    status: "ACTIVE",
    sortBy: "sortOrder",
    sortDirection: "asc",
  });

  const categories = categoryResponse?.data ?? [];

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    clearErrors,
    reset,
    formState: {
      errors,
    },
  } = useForm<CreateCommunityFormValues>({
    resolver: standardSchemaResolver(createCommunitySchema),
    defaultValues: {
      name: "",
      categoryId: "",
      visibility: "PUBLIC",
      description: "",
    },
  });

  const selectedCategoryId = watch("categoryId");
  const selectedVisibility = watch("visibility");

  const handleOpenChange = (nextOpen: boolean) => {
    if (isCreating) {
      return;
    }

    setOpen(nextOpen);

    if (!nextOpen) {
      reset();
    }
  };

  const onSubmit = async (
    values: CreateCommunityFormValues,
  ) => {
    try {
      await createCommunity({
        name: values.name,
        categoryId: values.categoryId,
        visibility: values.visibility,
        description: values.description || undefined,
      }).unwrap();

      toast.success("Community created successfully.");

      reset();
      setOpen(false);
      onCreated?.();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const hasNoCategories =
    !isLoadingCategories &&
    !isCategoryError &&
    categories.length === 0;

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
    >
      <DialogTrigger asChild>
        <Button className="h-10 bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="mr-2 size-4" />
          Add Community
        </Button>
      </DialogTrigger>

      <DialogContent
        className="border-border bg-card text-card-foreground sm:max-w-[520px]"
        onInteractOutside={(event) => {
          if (isCreating) {
            event.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-foreground">
            Add Community
          </DialogTitle>

          <DialogDescription className="text-muted-foreground">
            Create a new community. Your admin account will become its owner.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-5 pt-3"
        >
          <div className="space-y-2">
            <Label
              htmlFor="community-name"
              className="text-sm font-medium text-foreground"
            >
              Community name
            </Label>

            <Input
              id="community-name"
              type="text"
              placeholder="For example: Kathmandu Food Lovers"
              disabled={isCreating}
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
            <Label className="text-sm font-medium text-foreground">
              Category
            </Label>

            <Select
              value={selectedCategoryId}
              onValueChange={(value) => {
                setValue("categoryId", value, {
                  shouldValidate: true,
                  shouldDirty: true,
                });
                clearErrors("categoryId");
              }}
              disabled={isCreating || isLoadingCategories}
            >
              <SelectTrigger
                className="h-11 w-full border-input bg-background"
                aria-invalid={Boolean(errors.categoryId)}
              >
                <SelectValue
                  placeholder={
                    isLoadingCategories
                      ? "Loading categories..."
                      : "Select a category"
                  }
                />
              </SelectTrigger>

              <SelectContent className="border-border bg-popover text-popover-foreground">
                {categories.map((category) => (
                  <SelectItem
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {errors.categoryId?.message && (
              <p className="text-sm text-destructive">
                {errors.categoryId.message}
              </p>
            )}

            {isCategoryError && (
              <p className="text-sm text-destructive">
                Unable to load active categories.
              </p>
            )}

            {hasNoCategories && (
              <p className="text-sm text-muted-foreground">
                Create an active category before adding a community.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">
              Visibility
            </Label>

            <Select
              value={selectedVisibility}
              onValueChange={(value) => {
                setValue(
                  "visibility",
                  value as "PUBLIC" | "PRIVATE",
                  {
                    shouldValidate: true,
                    shouldDirty: true,
                  },
                );
              }}
              disabled={isCreating}
            >
              <SelectTrigger className="h-11 w-full border-input bg-background">
                <SelectValue />
              </SelectTrigger>

              <SelectContent className="border-border bg-popover text-popover-foreground">
                <SelectItem value="PUBLIC">
                  Public
                </SelectItem>

                <SelectItem value="PRIVATE">
                  Private
                </SelectItem>
              </SelectContent>
            </Select>

            {errors.visibility?.message && (
              <p className="text-sm text-destructive">
                {errors.visibility.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <Label
                htmlFor="community-description"
                className="text-sm font-medium text-foreground"
              >
                Description
              </Label>

              <span className="text-xs text-muted-foreground">
                Optional
              </span>
            </div>

            <Textarea
              id="community-description"
              placeholder="Write a short description of this community."
              disabled={isCreating}
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
              disabled={isCreating}
              onClick={() => handleOpenChange(false)}
              className="border-border bg-background hover:bg-muted"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={
                isCreating ||
                isLoadingCategories ||
                isCategoryError ||
                hasNoCategories
              }
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isCreating && (
                <LoaderCircle className="mr-2 size-4 animate-spin" />
              )}

              {isCreating
                ? "Creating..."
                : "Create Community"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}