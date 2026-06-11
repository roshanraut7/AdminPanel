"use client";

import { useState } from "react";
import { LoaderCircle, MapPinPlus } from "lucide-react";
import { toast } from "sonner";

import { useGetCategoriesQuery } from "@/lib/redux/services/category-api";
import { useCreateOfficialDistrictCommunityMutation } from "@/lib/redux/services/community-api";

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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { NEPAL_DISTRICTS} from "@/constants/nepal-district";

interface AddDistrictCommunityFormProps {
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

  return "Unable to create district community. Please try again.";
}

export function AddDistrictCommunityForm({
  onCreated,
}: AddDistrictCommunityFormProps) {
  const [open, setOpen] = useState(false);
  const [districtKey, setDistrictKey] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");

  const [
    createOfficialDistrictCommunity,
    { isLoading: isCreating },
  ] = useCreateOfficialDistrictCommunityMutation();

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

  const selectedDistrict = NEPAL_DISTRICTS.find(
    (district) => district.key === districtKey,
  );

  const hasNoCategories =
    !isLoadingCategories &&
    !isCategoryError &&
    categories.length === 0;

  const resetForm = () => {
    setDistrictKey("");
    setCategoryId("");
    setDescription("");
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (isCreating) {
      return;
    }

    setOpen(nextOpen);

    if (!nextOpen) {
      resetForm();
    }
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!selectedDistrict) {
      toast.error("Please select a district.");
      return;
    }

    if (!categoryId) {
      toast.error("Please select a category.");
      return;
    }

    try {
      await createOfficialDistrictCommunity({
        districtKey: selectedDistrict.key,
        districtName: selectedDistrict.name,
        categoryId,
        description: description.trim() || undefined,
      }).unwrap();

      toast.success(
        `${selectedDistrict.name} district community created successfully.`,
      );

      resetForm();
      setOpen(false);
      onCreated?.();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="h-10 border-border bg-card hover:bg-muted"
        >
          <MapPinPlus className="mr-2 size-4" />
          Add District Community
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
            Add District Community
          </DialogTitle>

          <DialogDescription className="text-muted-foreground">
            Create an official district community. Existing users from this
            district will be automatically added.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="space-y-5 pt-3"
        >
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">
              District
            </Label>

            <Select
              value={districtKey}
              onValueChange={setDistrictKey}
              disabled={isCreating}
            >
              <SelectTrigger className="h-11 w-full border-input bg-background">
                <SelectValue placeholder="Select a district" />
              </SelectTrigger>

              <SelectContent className="border-border bg-popover text-popover-foreground">
                {NEPAL_DISTRICTS.map((district) => (
                  <SelectItem
                    key={district.key}
                    value={district.key}
                  >
                    {district.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <p className="text-xs text-muted-foreground">
              Community name will be created automatically, for example:
              Kathmandu Community.
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">
              Category
            </Label>

            <Select
              value={categoryId}
              onValueChange={setCategoryId}
              disabled={isCreating || isLoadingCategories}
            >
              <SelectTrigger className="h-11 w-full border-input bg-background">
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

            {isCategoryError && (
              <p className="text-sm text-destructive">
                Unable to load active categories.
              </p>
            )}

            {hasNoCategories && (
              <p className="text-sm text-muted-foreground">
                Create an active category before adding a district community.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <Label
                htmlFor="district-community-description"
                className="text-sm font-medium text-foreground"
              >
                Description
              </Label>

              <span className="text-xs text-muted-foreground">
                Optional
              </span>
            </div>

            <Textarea
              id="district-community-description"
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              placeholder="Leave empty to use the default district community description."
              disabled={isCreating}
              className="min-h-28 resize-none border-input bg-background"
            />
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
                : "Create District Community"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}