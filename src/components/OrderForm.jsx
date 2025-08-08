import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "../styles/OrderForm.css";

const schema = yup.object({
  orderId: yup.string().matches(/^\d+$/, "Somente números").required("Obrigatório"),
  cliente: yup.string().required("Obrigatório"),
  observacoes: yup.string().notRequired(),
});

export default function OrderForm({ onSubmit, disabled }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema)
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="order-form">
      <div>
        <input
          type="text"
          placeholder="ID do Pedido"
          {...register("orderId")}
          className="order-form-input"
          disabled={disabled||isSubmitting}
        />
        {errors.orderId && <p className="order-form-error">{errors.orderId.message}</p>}
      </div>
      <div>
        <input
          type="text"
          placeholder="Nome do Cliente"
          {...register("cliente")}
          className="order-form-input"
          disabled={disabled||isSubmitting}
        />
        {errors.cliente && <p className="order-form-error">{errors.cliente.message}</p>}
      </div>
      <div>
        <textarea
          placeholder="Observações (opcional)"
          {...register("observacoes")}
          className="order-form-textarea"
          rows={3}
          disabled={disabled||isSubmitting}
        />
      </div>
      <button
        type="submit"
        disabled={disabled||isSubmitting}
        className="order-form-button"
      >
        {isSubmitting ? "Cadastrando..." : "Cadastrar Pedido"}
      </button>
    </form>
  );
}
