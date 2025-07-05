import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { SendHorizonal } from "lucide-react";
import { FadeIn } from "../animations/FadeIn";

const schema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email"),
});

type NewsletterForm = z.infer<typeof schema>;

export const Newsletter = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterForm>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: NewsletterForm) => {
    await new Promise((res) => setTimeout(res, 1000)); // simulate async
    toast.success("🎉 You've been subscribed!");
    reset();
  };

  return (
    <section className="bg-blue-600 text-white py-16 px-4">
      <div className="max-w-3xl mx-auto text-center space-y-6">
        <FadeIn>
          <SendHorizonal className="mx-auto w-10 h-10 text-white" />
          <h2 className="text-3xl md:text-4xl font-bold">Subscribe for Exclusive Hotel Deals</h2>
          <p className="text-white/90 max-w-md mx-auto">
            Join thousands of travelers receiving early access to premium hotel discounts, curated stays, and expert tips.
          </p>
        </FadeIn>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col sm:flex-row items-center gap-4 max-w-xl mx-auto mt-4"
        >
          <div className="w-full">
            <input
              type="email"
              {...register("email")}
              placeholder="Enter your email"
              disabled={isSubmitting}
              className="input input-bordered w-full text-gray-800 bg-white placeholder-gray-500 focus:outline-none"
            />
            {errors.email && (
              <p className="text-sm text-red-200 mt-1 text-left">{errors.email.message}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-accent w-full sm:w-auto px-6"
          >
            {isSubmitting ? "Subscribing..." : "Subscribe"}
          </button>
        </form>
      </div>
    </section>
  );
};
