export interface CategoryDto {
  categoryId: string;
  categoryName: string;
  description?: string;
  parentId?: string | null;
  subCategories?: CategoryDto[];
}

export interface CreateCategoryCommand {
  categoryName: string;
  description?: string;
  parentId?: string | null;
}

export interface UpdateCategoryCommand {
  categoryName: string;
  description?: string;
  parentId?: string | null;
}
