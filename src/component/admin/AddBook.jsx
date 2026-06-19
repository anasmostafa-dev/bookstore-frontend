import { Checkbox, FormControlLabel, Stack } from "@mui/material";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../auth/AuthContext";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const AddBook = () => {
  const [categories, setCategories] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [loadingCat, setloadingCat] = useState(true);
  const [msg, setMsg] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const [form, setForm] = useState({
    title: "",
    author: "",
    description: "",
    price: "",
    oldPrice: "",
    stock: "",
    category: "",
    discountPercent: "",
    isFeatured: false,
    isOnSale: false,
    coverImage: null,
  });

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated && !isAdmin) {
      navigate("/", { replace: true });
      return;
    }
    const loadCats = async () => {
      try {
        const res = await fetch(
          "https://bookstore-backend-blond.vercel.app/api/categories/getCategories",
          { method: "GET", credentials: "include" },
        );
        if (res.status === 401 || res.status === 403) {
          navigate("/", { replace: true });
          return;
        }
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.log(`Failed To Load Categories: ${err}`);
      } finally {
        setloadingCat(false);
      }
    };
    loadCats();
  }, [navigate, isAuthenticated, isAdmin, loading]);

  const onChange = (e) => {
    const { name, type, value, checked, files } = e.target;
    if (type == "file") {
      const file = files?.[0] || null;

      setForm((p) => ({ ...p, [name]: file }));
      setPreview(file ? URL.createObjectURL(file) : null);
      return;
    }
    if (type == "checkbox") {
      setForm((p) => ({ ...p, [name]: checked }));
      return;
    }

    setForm((p) => ({ ...p, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);
    if (!isAuthenticated || !isAdmin) {
      navigate("/", { replace: true });
      return;
    }

    setSubmitting(true);
    if (
      !form.title ||
      !form.author ||
      !form.description ||
      !form.stock ||
      !form.price
    ) {
      setMsg(
        "All fields (title, author, description, price, stock) are required",
      );
      return;
    }
    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("author", form.author);
    fd.append("description", form.description);
    fd.append("price", String(form.price));
    fd.append("oldPrice", String(form.price));
    fd.append("stock", String(form.stock));
    if (form.category) fd.append("category", form.category);
    fd.append("discountPercent", Number(form.discountPercent) || 0);
    if (form.coverImage) fd.append("coverImage", form.coverImage);
    fd.append("isFeatured", String(form.isFeatured));
    fd.append("isOnSale", String(form.isOnSale));

    try {
      const res = await fetch(
        "https://bookstore-backend-blond.vercel.app/admin/add-book",
        {
          method: "POST",
          body: fd,
          credentials: "include",
        },
      );

      if (res.status === 401 || res.status === 403) {
        setMsg("Not Authorized");
        navigate("/", { replace: true });
        return;
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to create book");

      setMsg("Book added successfully");
      setTimeout(() => setMsg(null), 3000);
      setForm({
        title: "",
        author: "",
        description: "",
        price: "",
        stock: "",
        category: "",
        discountPercent: 0,
        isFeatured: false,
        isOnSale: false,
        coverImage: null,
      });
      setPreview(null);
    } catch (err) {
      console.error("Error creating book:", err.message);
      setMsg(err.message);
    } finally {
      setSubmitting(false);
    }
  };
  if (loading) return null;
  if (!isAuthenticated || !isAdmin) return null;

  return (
    <div className="flex flex-col">
      <h3 className="my-10">Add Book</h3>
      <div className="bg-white mx-auto w-fit p-4 rounded-xl border border-gray-400">
        <form className="flex flex-col text-md" onSubmit={onSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-black" htmlFor="name">
                Title *
              </label>
              <input
                name="title"
                onChange={onChange}
                placeholder="book title"
                className="h-10 p-2 mt-2 w-full border border-gray-500/30 rounded outline-none focus:border-indigo-300 "
                type="text"
                required
                value={form.title}
              />
            </div>
            <div>
              <label className="text-black" htmlFor="name">
                Author *
              </label>
              <input
                name="author"
                onChange={onChange}
                placeholder="Author name"
                className="h-10 p-2 mt-2 w-full border border-gray-500/30 rounded outline-none focus:border-indigo-300 "
                type="text"
                required
                value={form.author}
              />
            </div>
            <div>
              <label className="text-black">Price</label>
              <input
                name="price"
                onChange={onChange}
                placeholder="e.g. 200"
                className="h-10 p-2 mt-2 w-full border border-gray-500/30 rounded outline-none focus:border-indigo-300"
                type="number"
                required
                value={form.price}
              />
            </div>

            <div>
              <label className="text-black" htmlFor="name">
                Stoke *
              </label>
              <input
                name="stock"
                onChange={onChange}
                type="number"
                placeholder="e.g. 20"
                className="h-10 p-2 mt-2 w-full border border-gray-500/30 rounded outline-none focus:border-indigo-300 "
                required
                value={form.stock}
              />
            </div>
          </div>

          <div className="mt-6 w-full">
            <label className="text-black" htmlFor="name">
              Description *
            </label>
            <textarea
              name="description"
              placeholder="Write a short description..."
              className="w-full mt-2 p-2 h-20 border border-gray-500/30 rounded resize-none outline-none focus:border-indigo-300"
              required
              value={form.description}
              onChange={onChange}
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mt-6 w-full">
              <label className="text-black" htmlFor="category">
                Category *
              </label>

              <select
                name="category"
                className="h-10 p-2 mt-2 w-full border border-gray-500/30 rounded outline-none focus:border-indigo-300 bg-white"
                required
                onChange={onChange}
                value={form.category}
              >
                <option value="" className="text-black/50" disabled>
                  Select category
                </option>
                {categories?.map((c) => {
                  return (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="mt-6 w-full">
              <label className="text-black" htmlFor="name">
                Discount Percent *
              </label>
              <input
                name="discountPercent"
                value={form.discountPercent}
                onChange={onChange}
                placeholder="e.g. 20"
                className="h-10 p-2 mt-2 w-full border border-gray-500/30 rounded outline-none focus:border-indigo-300 "
                type="number"
                min="0"
                max="100"
                required
              />
            </div>
          </div>
          <Stack direction={"row"} mt={3}>
            <FormControlLabel
              control={
                <Checkbox
                  name="isFeatured"
                  checked={form.isFeatured}
                  onChange={onChange}
                />
              }
              label="Featured"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="isOnSale"
                  checked={form.isOnSale}
                  onChange={onChange}
                />
              }
              label="On Sale"
            />
          </Stack>
          <Stack gap={1}>
            <b>Cover Image</b>
            {preview && (
              <img
                src={preview}
                alt="cover preview"
                className=" mt-2 w-32 h-40 object-cover rounded"
              />
            )}
            <Button
              component="label"
              role={undefined}
              variant="outlined"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
              className="flex items-center gap-1 border border-gray-400! text-slate-900! font-bold! w-50"
            >
              Upload files
              <VisuallyHiddenInput
                type="file"
                name="coverImage"
                onChange={onChange}
              />
            </Button>
          </Stack>

          <button
            type="submit"
            className="mt-5 mx-auto bg-slate-900! text-white h-12 w-56 px-4 rounded hover:bg-slate-800! active:scale-80 transition"
          >
            {submitting ? "Submitting..." : "Create Book"}
          </button>
          {msg && (
            <div className="fixed flex bottom-5 bg-white space-x-3 p-4 shadow-2xl rounded-xl border border-green-100">
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16.5 8.31V9a7.5 7.5 0 1 1-4.447-6.855M16.5 3 9 10.508l-2.25-2.25"
                  stroke="#22C55E"
                  strokWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div>
                <h2 className="text-slate-700 font-medium">
                  Successfully Created!
                </h2>
                <p className="text-slate-500">{msg}</p>
              </div>
              <a
                type="button"
                aria-label="close"
                className="cursor-pointer mb-auto text-slate-400 hover:text-slate-600 active:scale-95 transition"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    y="12.532"
                    width="17.498"
                    height="2.1"
                    rx="1.05"
                    transform="rotate(-45.74 0 12.532)"
                    fill="currentColor"
                    fill-opacity=".7"
                  />
                  <rect
                    x="12.531"
                    y="13.914"
                    width="17.498"
                    height="2.1"
                    rx="1.05"
                    transform="rotate(-135.74 12.531 13.914)"
                    fill="currentColor"
                    fill-opacity=".7"
                  />
                </svg>
              </a>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddBook;
