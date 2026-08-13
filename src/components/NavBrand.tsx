/** Бренд НавИИгатор с акцентом на ИИ */
export function NavBrand({ className = "" }: { className?: string }) {
  return (
    <span className={`font-bold tracking-tight ${className}`}>
      Нав<span className="text-yandex-red font-extrabold">ИИ</span>гатор
    </span>
  );
}
