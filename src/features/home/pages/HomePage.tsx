import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { getCategories } from "features/home/api/categoryApi";
import { getProducts } from "features/home/api/productApi";
import { CategoryOption, HomeProduct } from "features/home/types/product";
import ProductGrid from "features/home/components/ProductGrid/ProductGrid";
import "./HomePage.css";

const SORT_OPTIONS = [
  { value: "recommended", label: "Recommended" },
  { value: "popularity", label: "Popularity" },
  { value: "latest", label: "Latest" },
  { value: "discount", label: "Discount" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "rating", label: "Customer Rating" },
];

const parseCategories = (value: string | null): string[] =>
  value ? value.split(",").filter(Boolean) : [];

const applySort = (products: HomeProduct[], sort: string) => {
  const items = [...products];

  if (sort === "price_asc") {
    return items.sort((a, b) => a.price - b.price);
  }

  if (sort === "price_desc") {
    return items.sort((a, b) => b.price - a.price);
  }

  if (sort === "name_desc") {
    return items.sort((a, b) => b.title.localeCompare(a.title));
  }

  return items.sort((a, b) => a.title.localeCompare(b.title));
};

const normalizeProduct = (raw: any): HomeProduct => ({
  id: raw.id,
  title: raw.title ?? raw.name,
  price: raw.price ?? 0,
  description: raw.description,
  image: raw.image ?? raw.images?.[0],
  images: raw.images,
  category: raw.category ? { id: raw.category.id, name: raw.category.name } : undefined,
  subtitle: raw.category?.name,
  oldPrice: raw.price ? Math.round(raw.price * 1.6) : undefined,
  discount: raw.price ? Math.round(((Math.round(raw.price * 1.6) - raw.price) / Math.round(raw.price * 1.6)) * 100) : undefined,
  rating: raw.rating ? { rate: raw.rating?.rate ?? raw.rating, count: raw.rating?.count } : undefined,
  soldCount: raw.soldCount ?? raw.rating?.count,
});

const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [products, setProducts] = useState<HomeProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [mobileSortOpen, setMobileSortOpen] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedPrices, setSelectedPrices] = useState<string[]>([]);

  const selectedCategories = useMemo(
    () => parseCategories(searchParams.get("categories")),
    [searchParams]
  );

  const sortBy = searchParams.get("sort") ?? "recommended";

  useEffect(() => {
    getCategories()
      .then((data) => setCategories(data))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);

    getProducts({ categories: selectedCategories, limit: 24 })
      .then((data) => {
        const normalized = data.map(normalizeProduct);
        setProducts(applySort(normalized, sortBy));
      })
      .catch(() => setError("Unable to load products right now."))
      .finally(() => setLoading(false));
  }, [selectedCategories.join(","), sortBy]);

  const toggleCategory = (categoryId: string) => {
    const nextCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((id) => id !== categoryId)
      : [...selectedCategories, categoryId];

    const params = new URLSearchParams(searchParams);
    if (nextCategories.length > 0) {
      params.set("categories", nextCategories.join(","));
    } else {
      params.delete("categories");
    }

    setSearchParams(params);
  };

  const toggleSelection = (
    value: string,
    selected: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (selected.includes(value)) {
      setter(selected.filter((item) => item !== value));
      return;
    }

    setter([...selected, value]);
  };

  const handleSortChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams);
    if (event.target.value) {
      params.set("sort", event.target.value);
    } else {
      params.delete("sort");
    }

    setSearchParams(params);
  };

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("categories");
    setSearchParams(params);
    setSelectedBrands([]);
    setSelectedSizes([]);
    setSelectedPrices([]);
  };

  const visibleCategories = showAllCategories ? categories : categories.slice(0, 8);
  const hiddenCategoryCount = Math.max(categories.length - visibleCategories.length, 0);
  const categoryToggleLabel = showAllCategories ? "Show less" : `+ ${hiddenCategoryCount} more`;

  return (
    <section className="home_page" aria-labelledby="home-heading">
      <section className="home_actions">
        <div className="home_top_actions desktop_only">
          <div className="sort_header">
            <label htmlFor="sort-select" className="filter_label desktop_sort_label">Sort by :</label>
            <select id="sort-select" value={sortBy} onChange={handleSortChange} className="sort_select">
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <button type="button" className="clear_action" onClick={clearFilters}>
            Clear all
          </button>
        </div>
      </section>

      <div className="home_layout">
        <aside className="desktop_filter_panel" aria-label="Product filters">
          <div className="sidebar_header">
            <h2>FILTERS</h2>
          </div>

          <div className="sidebar_section">
            <div className="filter_section_header">
              <span>CATEGORIES</span>
            </div>
            <div className="category_list sidebar_list">
              {visibleCategories.map((category) => {
                const categoryId = String(category.id);
                const active = selectedCategories.includes(categoryId);
                return (
                  <label key={category.id} className={`category_item ${active ? "active" : ""}`}>
                    <span className="category_option">
                      <input type="checkbox" checked={active} onChange={() => toggleCategory(categoryId)} />
                      <span className="category_name">{category.name}</span>
                    </span>
                    {category.count !== undefined && <span className="category_count">{category.count}</span>}
                  </label>
                );
              })}
            </div>
          </div>
        </aside>

        <main className="product_section">
          {loading && (
            <section className="status_message" role="status" aria-live="polite">
              <strong>Loading products…</strong>
              Please wait while we fetch the latest selection.
            </section>
          )}

          {error && (
            <section className="status_message" role="alert">
              <strong>Error</strong>
              {error}
            </section>
          )}

          {!loading && !error && <ProductGrid products={products} />}
        </main>
      </div>

      <section className="mobile_bottom_bar" aria-label="Mobile sort and filter actions">
        <button type="button" className="mobile_action_button" onClick={() => setMobileSortOpen(true)}>
          <span>↕</span>
          SORT
        </button>
        <button type="button" className="mobile_action_button" onClick={() => setMobileFilterOpen(true)}>
          <span>≡</span>
          FILTER
        </button>
      </section>

      {mobileSortOpen && (
        <div className="drawer_overlay" role="dialog" aria-modal="true">
          <div className="mobile_drawer">
            <div className="drawer_header">
              <h3>Sort by</h3>
              <button type="button" className="drawer_close" onClick={() => setMobileSortOpen(false)}>
                Close
              </button>
            </div>
            <div className="drawer_body">
              {SORT_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`drawer_option ${sortBy === option.value ? "active" : ""}`}
                  onClick={() => {
                    const params = new URLSearchParams(searchParams);
                    params.set("sort", option.value);
                    setSearchParams(params);
                    setMobileSortOpen(false);
                  }}
                >
                  <span>{option.label}</span>
                  {sortBy === option.value && <strong>Selected</strong>}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {mobileFilterOpen && (
        <div className="drawer_overlay" role="dialog" aria-modal="true">
          <div className="mobile_drawer">
            <div className="drawer_header">
              <h3>Filter</h3>
              <button type="button" className="drawer_close" onClick={() => setMobileFilterOpen(false)}>
                Close
              </button>
            </div>
            <div className="drawer_body">
              <div className="filter_section">
                <div className="filter_section_header">
                  <span>CATEGORIES</span>
                  {categories.length > 8 && (
                    <button type="button" className="category_more" onClick={() => setShowAllCategories((value) => !value)}>
                      {categoryToggleLabel}
                    </button>
                  )}
                </div>
                <div className="category_list mobile_list">
                  {visibleCategories.map((category) => {
                    const categoryId = String(category.id);
                    const active = selectedCategories.includes(categoryId);
                    return (
                      <label key={category.id} className={`category_item ${active ? "active" : ""}`}>
                        <span className="category_option">
                          <input type="checkbox" checked={active} onChange={() => toggleCategory(categoryId)} />
                          <span className="category_name">{category.name}</span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default HomePage;
