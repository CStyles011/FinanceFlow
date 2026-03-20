import { FolderKanban, Pencil, Plus, Trash2 } from 'lucide-react';
import { SectionHeader } from '@/components/SectionHeader';
import { useFinance } from '@/store/FinanceContext';
import { Modal } from '@/components/Modal';
import { useState } from 'react';
import { Category } from '@/types';
import { CategoryForm } from '@/components/CategoryForm';

export function CategoriesPage() {
  const { categories, deleteCategory } = useFinance();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Categorias"
        title="Organize seu dinheiro com inteligência"
        description="Use categorias padrão e personalize novas classificações com identidade própria para enxergar padrões de consumo com clareza."
        action={
          <button
            onClick={() => {
              setEditing(null);
              setModalOpen(true);
            }}
            className="rounded-2xl bg-gradient-to-r from-brand to-accent px-4 py-3 text-sm font-semibold text-ink transition hover:opacity-90"
            type="button"
          >
            <span className="flex items-center gap-2">
              <Plus size={16} /> Nova categoria
            </span>
          </button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => (
          <div key={category.id} className="panel p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="rounded-3xl p-4" style={{ backgroundColor: `${category.color}20`, color: category.color }}>
                  <FolderKanban size={22} />
                </div>
                <div>
                  <h3 className="font-semibold">{category.name}</h3>
                  <p className="mt-1 text-sm text-slate-400">{category.builtIn ? 'Categoria padrão do sistema' : 'Categoria personalizada'}</p>
                </div>
              </div>
              {!category.builtIn ? (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(category);
                      setModalOpen(true);
                    }}
                    className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:bg-white/10"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteCategory(category.id)}
                    className="rounded-xl border border-danger/20 bg-danger/10 p-2 text-danger transition hover:bg-danger/20"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      <Modal
        title={editing ? 'Editar categoria' : 'Nova categoria'}
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
      >
        <CategoryForm
          initialValue={editing}
          onSubmitDone={() => {
            setModalOpen(false);
            setEditing(null);
          }}
        />
      </Modal>
    </div>
  );
}
