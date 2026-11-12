import './App.css'

const stats = [
  { value: '4.9/5', label: 'Avaliação dos clientes' },
  { value: '12K+', label: 'Experiências imersivas' },
  { value: '98%', label: 'Satisfação corporativa' },
  { value: '24/7', label: 'Suporte técnico' },
]

const features = [
  {
    icon: '01',
    title: 'Display 4K+',
    text: 'Imagens ultra nítidas com resolução 4K para experiências de alta fidelidade visual.',
  },
  {
    icon: '02',
    title: 'Sensor de movimento',
    text: 'Rastreamento preciso que acompanha cada movimento para maior realismo e conforto.',
  },
  {
    icon: '03',
    title: 'Conectividade híbrida',
    text: 'Compatível com PC, consoles, mobile e ambientes corporativos com baixa latência.',
  },
  {
    icon: '04',
    title: 'Design ergonômico',
    text: 'Estrutura leve com conforto prolongado, ideal para treinamento e entretenimento.',
  },
]

const useCases = [
  'Simulação corporativa',
  'Treinamento industrial',
  'Educação imersiva',
  'Entretenimento premium',
  'Arquitetura e design',
  'Saúde e reabilitação',
]

const testimonials = [
  {
    quote:
      'A tecnologia da VIRTUA transformou nossa operação. Treinamentos ficaram mais seguros, rápidos e envolventes.',
    author: 'Marina Costa',
    role: 'COO da NovaForge',
  },
  {
    quote:
      'A qualidade visual e o conforto do óculos superaram todas as expectativas do time de inovação.',
    author: 'Rafael Nunes',
    role: 'Diretor de Produtos da PixelLab',
  },
]

function App() {
  return (
    <div className="page-shell">
      <header className="topbar">
        <div className="brand" aria-label="Virtua brand logo">
          <span className="brand-mark">V</span>
          <span>VIRTUA</span>
        </div>

        <nav className="nav" aria-label="Main navigation">
          <a href="#produtos">Produtos</a>
          <a href="#solucoes">Soluções</a>
          <a href="#experiencias">Experiências</a>
          <a href="#contato">Contato</a>
        </nav>

        <button type="button" className="nav-button">
          Agendar demo
        </button>
      </header>

      <main>
        <section className="hero section">
          <div className="hero-copy">
            <span className="eyebrow">Realidade imersiva e sem limites</span>
            <h1>Óculos de realidade virtual feitos para levar ideias ao próximo nível.</h1>
            <p>
              A VIRTUA cria experiências de imersão premium para educação, negócios,
              entretenimento e treinamento, conectando tecnologia e performance em uma só solução.
            </p>

            <div className="hero-actions">
              <button type="button" className="primary-btn">
                Solicitar orçamento
              </button>
              <button type="button" className="secondary-btn">
                Ver catálogo
              </button>
            </div>

            <div className="mini-stats" aria-label="Company statistics">
              {stats.slice(0, 3).map((item) => (
                <div key={item.label} className="mini-stat">
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-visual" aria-label="Product hero illustration">
            <div className="orb orb-one" />
            <div className="orb orb-two" />
            <div className="visor-frame">
              <div className="visor-lens lens-left" />
              <div className="visor-lens lens-right" />
              <div className="visor-bridge" />
            </div>

            <div className="floating-card card-top">
              <span>Tracking 3D</span>
              <strong>120 fps</strong>
            </div>
            <div className="floating-card card-bottom">
              <span>Campo visual</span>
              <strong>110°</strong>
            </div>
          </div>
        </section>

        <section className="brand-strip" aria-label="Trusted companies">
          <span>Trusted by</span>
          <ul>
            <li>NEBULA</li>
            <li>ORBITAL</li>
            <li>PRISM</li>
            <li>AETHER</li>
            <li>VECTRA</li>
          </ul>
        </section>

        <section className="section features" id="produtos">
          <div className="section-heading">
            <span className="eyebrow">Por que escolher a VIRTUA</span>
            <h2>Tecnologia premium para experiências profundas e intuitivas.</h2>
          </div>

          <div className="feature-grid">
            {features.map((feature) => (
              <article key={feature.title} className="feature-card">
                <span className="feature-index">{feature.icon}</span>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section showcase" id="solucoes">
          <div className="showcase-visual">
            <div className="tech-panel">
              <div className="panel-header">
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
              </div>
              <div className="panel-body">
                <div className="panel-graph" />
                <div className="panel-bars">
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </div>
          </div>

          <div className="showcase-copy">
            <span className="eyebrow">Produto principal</span>
            <h2>Óculos VR X-9</h2>
            <p>
              Leve, elegante e imersivo, o X-9 oferece alto desempenho para ambientes
              corporativos, educacionais e de entretenimento com conforto de uso prolongado.
            </p>

            <ul className="product-list">
              <li>Display OLED com contraste realista</li>
              <li>Rastreamento preciso em 6 eixos</li>
              <li>Conexão sem fio com baixa latência</li>
              <li>Modo foco e conforto com ajuste facial inteligente</li>
            </ul>

            <div className="price-box">
              <strong>R$ 2.499</strong>
              <span>ou em até 12x sem juros</span>
            </div>
          </div>
        </section>

        <section className="section metrics" id="experiencias">
          <div className="metric-box">
            <strong>80%</strong>
            <span>mais engajamento em treinamentos</span>
          </div>
          <div className="metric-box">
            <strong>3x</strong>
            <span>mais produtividade em simulações</span>
          </div>
          <div className="metric-box">
            <strong>5.2s</strong>
            <span>tempo de início de experiência</span>
          </div>
          <div className="metric-box">
            <strong>100%</strong>
            <span>compatibilidade com plataformas</span>
          </div>
        </section>

        <section className="section use-cases">
          <div className="section-heading">
            <span className="eyebrow">Aplicações</span>
            <h2>Experiências que funcionam em qualquer cenário.</h2>
          </div>

          <div className="use-grid">
            {useCases.map((item) => (
              <div key={item} className="use-card">
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="section testimonials">
          <div className="section-heading">
            <span className="eyebrow">Depoimentos</span>
            <h2>Clientes que vivem a imersão da VIRTUA.</h2>
          </div>

          <div className="testimonial-grid">
            {testimonials.map((item) => (
              <article key={item.author} className="testimonial-card">
                <p>“{item.quote}”</p>
                <div className="person">
                  <strong>{item.author}</strong>
                  <span>{item.role}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section cta" id="contato">
          <div>
            <span className="eyebrow">Pronto para viver a próxima geração?</span>
            <h2>Leve sua empresa para o futuro da imersão digital.</h2>
          </div>
          <button type="button" className="primary-btn">
            Falar com especialista
          </button>
        </section>
      </main>

      <footer className="footer">
        <div className="brand" aria-label="Virtua brand logo footer">
          <span className="brand-mark">V</span>
          <span>VIRTUA</span>
        </div>
        <p>© 2026 VIRTUA. Realidade virtual para transformar experiências.</p>
      </footer>
    </div>
  )
}

export default App
