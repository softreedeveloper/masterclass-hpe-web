import { useState, type InputHTMLAttributes } from "react";
import { Input } from "../ui/Field";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
   label: string;
   error?: string | null;
   hint?: string;
   textos?: { show: string; hide: string };
}

export function PasswordInput({ textos = { show: "Mostrar", hide: "Ocultar" }, ...props }: Props) {
   const [ver, setVer] = useState(false);
   return (
      <div className="relative">
         <Input {...props} type={ver ? "text" : "password"} />
         <button
            type="button"
            onClick={() => setVer(!ver)}
            className="absolute top-0 right-0 text-xs font-medium text-hpe-dark hover:underline"
         >
            {ver ? textos.hide : textos.show}
         </button>
      </div>
   );
}
