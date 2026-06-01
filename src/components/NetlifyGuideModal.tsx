import { X, ExternalLink, ShieldCheck, Cpu, Cloud, FileCode } from 'lucide-react';

interface NetlifyGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NetlifyGuideModal({ isOpen, onClose }: NetlifyGuideModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[250] bg-black-pure/95 flex items-center justify-center p-4 backdrop-blur-md overflow-y-auto">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-surface-bg border border-surface-card rounded-[2px] overflow-hidden my-8"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-surface-card flex justify-between items-center bg-dark-matte">
          <div>
            <h3 className="font-serif text-xl text-white-pure font-light">
              Guia Completo de Publicação no <span className="text-gold italic font-serif">Netlify 🚀</span>
            </h3>
            <p className="text-[0.6rem] tracking-wider text-txt-muted uppercase mt-1">
              Como colocar seu portfólio no ar gratuitamente em minutos
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-txt-muted hover:text-gold transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto scrollbar-thin">
          {/* Welcome Alert */}
          <div className="p-4 bg-gold/5 border border-gold/20 text-txt-light text-xs leading-relaxed rounded-[1px]">
            <strong className="text-gold">Tudo Pronto para o Sucesso!</strong> Seus ajustes de biografias e substituições de imagens estão salvos no navegador. Agora, vamos publicar esse visual espetacular no Netlify para compartilhar com seus clientes e audiência.
          </div>

          {/* Quick Steps Timeline */}
          <div className="space-y-6">
            <h4 className="text-xs uppercase tracking-[0.25em] text-gold font-medium border-b border-surface-card pb-2">
              Método Super Simples (Arraste e Solte)
            </h4>

            <div className="relative border-l border-gold-dim/30 pl-6 ml-3 space-y-8">
              {/* Step 1 */}
              <div className="relative">
                <div className="absolute -left-[31px] top-0 w-4.5 h-4.5 bg-black-pure border border-gold rounded-full flex items-center justify-center text-gold text-[0.55rem] font-bold">
                  1
                </div>
                <h5 className="text-xs font-semibold text-white-pure tracking-wide flex items-center gap-2">
                  <Cpu className="w-3.5 h-3.5 text-gold" />
                  Gerar os Arquivos de Produção (Build)
                </h5>
                <p className="text-xs text-txt-muted mt-1 leading-relaxed">
                  Antes de publicar, os arquivos TypeScript e React precisam ser empacotados em HTML/CSS/JS puros. 
                  Isso é feito gerando uma pasta chamada <code className="px-1.5 py-0.5 bg-black-pure text-gold rounded font-mono text-[11px]">dist</code>. 
                  Como você está usando o AI Studio, o sistema já faz essa compilação automaticamente para você!
                </p>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <div className="absolute -left-[31px] top-0 w-4.5 h-4.5 bg-black-pure border border-gold rounded-full flex items-center justify-center text-gold text-[0.55rem] font-bold">
                  2
                </div>
                <h5 className="text-xs font-semibold text-white-pure tracking-wide flex items-center gap-2">
                  <FileCode className="w-3.5 h-3.5 text-gold" />
                  Baixar / Exportar seu Projeto
                </h5>
                <p className="text-xs text-txt-muted mt-1 leading-relaxed">
                  No menu de configurações do AI Studio (canto superior direito ou inferior), clique em 
                  <strong className="text-txt-light"> Exportar ZIP</strong> ou conecte à sua conta do 
                  <strong className="text-txt-light"> GitHub</strong>. Se baixar o ZIP, extraia-o em seu computador.
                </p>
              </div>

              {/* Step 3 */}
              <div className="relative">
                <div className="absolute -left-[31px] top-0 w-4.5 h-4.5 bg-black-pure border border-gold rounded-full flex items-center justify-center text-gold text-[0.55rem] font-bold">
                  3
                </div>
                <h5 className="text-xs font-semibold text-white-pure tracking-wide flex items-center gap-2">
                  <Cloud className="w-3.5 h-3.5 text-gold" />
                  Acessar o Netlify Drop
                </h5>
                <p className="text-xs text-txt-muted mt-1 leading-relaxed">
                  Acesse o site <a href="https://app.netlify.com/drop" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline inline-flex items-center gap-0.5 font-medium">Netlify Drop <ExternalLink className="w-3 h-3" /></a> em seu navegador. Não é necessário nem mesmo ter uma conta criada de início para testar!
                </p>
              </div>

              {/* Step 4 */}
              <div className="relative">
                <div className="absolute -left-[31px] top-0 w-4.5 h-4.5 bg-black-pure border border-gold rounded-full flex items-center justify-center text-gold text-[0.55rem] font-bold">
                  4
                </div>
                <h5 className="text-xs font-semibold text-white-pure tracking-wide flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-gold animate-pulse" />
                  Arrastar a Pasta "dist"
                </h5>
                <p className="text-xs text-txt-muted mt-1 leading-relaxed">
                  Arraste e solte a pasta <strong className="text-gold">dist</strong> extraída do seu projeto diretamente no círculo azul do Netlify Drop.
                  Em 5 segundos seu site fantástico estará no ar com uma URL pública (exemplo: <code className="text-xs text-gold font-mono">https://ai-faces-studio-example.netlify.app</code>)!
                </p>
              </div>
            </div>
          </div>

          {/* Alternative: GitHub Continuous Deployment */}
          <div className="p-5 border border-surface-card bg-black-pure/40 rounded-[2px] space-y-3">
            <h5 className="text-xs font-semibold text-gold tracking-wide uppercase">
              Melhor Prática: Integração Contínua com GitHub
            </h5>
            <p className="text-xs text-txt-muted leading-relaxed">
              Deseja que seu site se atualize sozinho toda vez que salvar um código?
            </p>
            <ul className="list-disc list-inside text-xs text-txt-muted space-y-1 pl-1">
              <li>Crie uma conta gratuita no <strong className="text-txt-light font-normal">GitHub</strong></li>
              <li>Exporte o projeto do AI Studio direto para o seu repositório GitHub</li>
              <li>No painel da Netlify, selecione <strong className="text-txt-light font-normal">"Import an existing project from GitHub"</strong></li>
              <li>Selecione o repositório e configure o Build Command como <code className="px-1 py-0.2 bg-surface-card text-gold rounded font-mono text-[10px]">npm run build</code> e a pasta de publicação como <code className="px-1 py-0.2 bg-surface-card text-gold rounded font-mono text-[10px]">dist</code></li>
            </ul>
          </div>
        </div>

        {/* Footer info lockup */}
        <div className="px-6 py-4 bg-dark-matte border-t border-surface-card flex justify-center items-center">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-gold text-black-pure font-normal text-[0.62rem] tracking-[0.25em] uppercase hover:bg-gold-light transition-all duration-200 rounded-[1px]"
          >
            Entendido, Excelente!
          </button>
        </div>
      </div>
    </div>
  );
}
