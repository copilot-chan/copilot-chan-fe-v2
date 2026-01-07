import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ProductImage } from './shared/ProductImage';
import { ProductPrice } from './shared/ProductPrice';
import { AddToCartButton } from './shared/AddToCartButton';
import { Clock, Users, ChefHat, Check, X, AlertTriangle } from 'lucide-react';
import { Product } from '@/lib/ecomerce/foodshop/types';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import Link from 'next/link';

// Types from spec
export type Difficulty = 'easy' | 'medium' | 'hard';

interface Ingredient {
  title: string;
  quantity: string;
  already_have: boolean;
  price?: number;
  product_id?: string; // Optional if it's just a generic ingredient, but usually we want to link
  image_url?: string;
}

interface Recipe {
  id: string;
  title: string;
  required_ingredients: Ingredient[];
  image_url?: string;
  cooking_time?: number; // minutes
  difficulty?: Difficulty;
  servings?: number;
  tags?: string[];
}

interface RecipeSuggestionProps {
  available_ingredients: { title: string; quantity?: string }[];
  suggested_recipes: Recipe[];
  context_message?: string;
  className?: string;
}

export function RecipeSuggestion({
  available_ingredients,
  suggested_recipes,
  context_message,
  className,
}: RecipeSuggestionProps) {
  
  // Calculate match percentage
  const getMatchInfo = (ingredients: Ingredient[] = []) => {
    const total = ingredients?.length || 0;
    if (total === 0) return { have: 0, total: 0, percentage: 0 };
    const have = ingredients.filter(i => i.already_have).length;
    const percentage = Math.round((have / total) * 100);
    return { have, total, percentage };
  };

  const getDifficultyColor = (diff?: Difficulty) => {
    switch (diff) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-muted-foreground bg-secondary';
    }
  };

  const toProduct = (ing: Ingredient): Product => ({
      id: ing.product_id || 'temp',
      handle: ing.title,
      title: ing.title,
      description: '',
      descriptionHtml: '',
      status: 'active',
      price: { amount: (ing.price || 0).toString(), currencyCode: 'VND' },
      featuredImage: { url: ing.image_url || '', altText: ing.title, width: 200, height: 200 },
      images: [],
      seo: { title: ing.title, description: '' },
      tags: [],
      collections: [],
      updatedAt: new Date().toISOString(),
      vendor: '',
      productType: '',
  });

  return (
    <div className={cn('w-full space-y-2 sm:space-y-4', className)}>
      {context_message && (
        <div className="bg-primary/10 p-2 sm:p-3 rounded-lg text-[10px] sm:text-xs md:text-sm text-primary font-medium">
          💡 {context_message}
        </div>
      )}

      {/* Available Ingredients Summary */}
      <div className="text-[10px] sm:text-xs md:text-sm text-muted-foreground bg-secondary/30 p-2 sm:p-3 rounded-lg flex flex-wrap gap-1 sm:gap-2">
        <span className="font-semibold text-foreground">Nguyên liệu: </span>
        {available_ingredients.slice(0, 5).map((i, idx) => (
          <Badge key={idx} variant="secondary" className="font-normal text-[8px] sm:text-[10px] px-1 sm:px-1.5 py-0">
            {i.title} {i.quantity && `(${i.quantity})`}
          </Badge>
        ))}
        {available_ingredients.length > 5 && (
          <Badge variant="outline" className="font-normal text-[8px] sm:text-[10px] px-1 py-0">
            +{available_ingredients.length - 5}
          </Badge>
        )}
      </div>

      <div className="grid gap-3 sm:gap-6">
        {suggested_recipes.map((recipe) => {
          const { have, total, percentage } = getMatchInfo(recipe.required_ingredients);
          const missingIngredients = recipe.required_ingredients.filter(i => !i.already_have);
          const missingCost = missingIngredients.reduce((acc, curr) => acc + (curr.price || 0), 0);

          let matchColor = 'bg-primary';
          if (percentage < 50) matchColor = 'bg-red-500';
          else if (percentage < 80) matchColor = 'bg-yellow-500';
          else matchColor = 'bg-green-500';

          return (
            <Card key={recipe.id} className="overflow-hidden">
              <div className="flex flex-col sm:flex-row">
                 {/* Image Section */}
                <div className="sm:w-1/3 relative">
                  <ProductImage
                    image={{ url: recipe.image_url || '', altText: recipe.title, width: 400, height: 300 }}
                    title={recipe.title}
                    aspectRatio="video"
                    className="w-full h-auto rounded-none"
                  />
                  <Badge className={cn("absolute top-1 left-1 sm:top-2 sm:left-2 text-[8px] sm:text-[10px] px-1 sm:px-1.5 py-0.5", matchColor)}>
                    KHỚP {percentage}%
                  </Badge>
                </div>

                {/* Content Section */}
                <div className="flex-1 p-2 sm:p-3 md:p-4 flex flex-col gap-1.5 sm:gap-3">
                  <div>
                    <h3 className="text-xs sm:text-sm md:text-base font-bold uppercase line-clamp-2">{recipe.title}</h3>
                    <div className="flex gap-2 sm:gap-4 text-[8px] sm:text-[10px] md:text-xs text-muted-foreground mt-0.5 sm:mt-1">
                      <span className="flex items-center gap-0.5 sm:gap-1"><Clock className="w-2 h-2 sm:w-3 sm:h-3"/> {recipe.cooking_time}p</span>
                      <span className={cn("flex items-center gap-0.5 sm:gap-1 px-1 py-0.5 rounded", getDifficultyColor(recipe.difficulty))}>
                        <ChefHat className="w-2 h-2 sm:w-3 sm:h-3"/> {recipe.difficulty === 'easy' ? 'Dễ' : recipe.difficulty === 'medium' ? 'Vừa' : 'Khó'}
                      </span>
                      <span className="flex items-center gap-0.5 sm:gap-1"><Users className="w-2 h-2 sm:w-3 sm:h-3"/> {recipe.servings}</span>
                    </div>
                  </div>
                  
                  {/* Ingredients Status */}
                  <div className="space-y-1 sm:space-y-2">
                      <div className="flex justify-between text-[10px] sm:text-xs">
                          <span className={percentage === 100 ? "text-green-600 font-medium" : "text-amber-600 font-medium"}>
                            {percentage === 100 ? <div className="flex items-center gap-1">
                              <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green-500" />
                              <span>Đủ nguyên liệu!</span>
                              </div>
                            : <div className="flex items-center gap-1 sm:gap-2">
                              <X className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-red-500" />
                              <span>
                                Thiếu {total - have}
                              </span>
                            </div>
                            }
                          </span>
                      </div>
                      
                      {/* Missing List */}
                      {missingIngredients.length > 0 && (
                          <div className="bg-destructive/5 rounded-md p-1.5 sm:p-2 space-y-1 sm:space-y-2">
                              <p className="text-[8px] sm:text-[10px] font-semibold text-destructive uppercase">Cần mua:</p>
                              {missingIngredients.slice(0, 3).map((ing, idx) => (
                                  <div key={idx} className="flex justify-between items-center text-[10px] sm:text-xs">
                                      <div className="flex items-center gap-1 sm:gap-2 min-w-0">
                                          <X className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 shrink-0" />
                                          {ing.product_id ? (
                                            <Link href={`/product/${ing.product_id}`} className="hover:text-primary transition-colors hover:underline truncate">
                                                <span>{ing.title}</span>
                                            </Link>
                                          ) : (
                                            <span className="truncate">{ing.title}</span>
                                          )}
                                      </div>
                                      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                                           {ing.price && <ProductPrice price={{ amount: ing.price.toString(), currencyCode: 'VND' }} className="text-[8px] sm:text-[10px]" />}
                                           {ing.product_id ? (
                                              <AddToCartButton
                                                product={toProduct(ing)}
                                                minimal
                                                className="h-4 w-4 sm:h-5 sm:w-5"
                                              />
                                           ) : (
                                              <Button size="icon" variant="ghost" className="h-4 w-4 sm:h-5 sm:w-5" disabled>
                                                  <AlertTriangle className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-muted-foreground" />
                                              </Button>
                                           )}
                                      </div>
                                  </div>
                              ))}
                              {missingIngredients.length > 3 && (
                                <p className="text-[8px] text-muted-foreground">+{missingIngredients.length - 3} món khác</p>
                              )}
                              {missingCost > 0 && (
                                <div className='pt-1 sm:pt-2 border-t border-destructive/10 flex justify-between items-center'>
                                     <span className='text-[8px] sm:text-[10px] font-bold'>Tổng:</span>
                                     <ProductPrice price={{ amount: missingCost.toString(), currencyCode: 'VND' }} className='text-destructive font-bold text-[10px] sm:text-xs' />
                                </div>
                              )}
                          </div>
                      )}

                      {/* Owned List */}
                      <div className="text-[8px] sm:text-[10px] text-muted-foreground">
                          <p className="font-medium mb-0.5 sm:mb-1">Đã có:</p>
                           <ul className="grid grid-cols-2 gap-0.5 sm:gap-1">
                               {recipe.required_ingredients.filter(i => i.already_have).slice(0, 4).map((ing, idx) => (
                                   <li key={idx} className="flex items-center gap-0.5 sm:gap-1">
                                       <Check className="w-2 h-2 sm:w-3 sm:h-3 text-green-500" />
                                       <span className="truncate">{ing.title}</span>
                                   </li>
                               ))}
                           </ul>
                      </div>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
