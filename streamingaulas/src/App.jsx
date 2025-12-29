import { useEffect, useRef, useState } from "react";

export default function App() {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const [videoAtivo, setVideoAtivo] = useState(null);

  const aulas = [
    {
      id: 1,
      titulo: "Aula 01 de React",
      categoria: "React",
      thumb: "/thumbnails/react1.jpeg",
      video: "/videos/react1.mp4",
    },
    {
      id: 2,
      titulo: "Aula 02 de React",
      categoria: "React",
      thumb: "/thumbnails/react2.png",
      video: "/videos/react2.mp4",
    },
    {
      id: 3,
      titulo: "Aula 03 de React",
      categoria: "React",
      thumb: "/thumbnails/react3.png",
      video: "/videos/react3.mp4",
    },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    const nodes = Array.from({ length: 45 }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
    }));

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      nodes.forEach((n) => {
        const dx = mouse.current.x - n.x;
        const dy = mouse.current.y - n.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 220) {
          n.vx += dx * 0.00003;
          n.vy += dy * 0.00003;
        }

        n.x += n.vx;
        n.y += n.vy;
        n.vx *= 0.98;
        n.vy *= 0.98;

        if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
      });

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 140) {
            ctx.strokeStyle = `rgba(255,255,255,${1 - dist / 140})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      nodes.forEach((n) => {
        ctx.fillStyle = "rgba(255,255,255,0.8)";
        ctx.beginPath();
        ctx.arc(n.x, n.y, 1.4, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener("mousemove", (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    });

    return () => window.removeEventListener("resize", resize);
  }, []);

  const handleTilt = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateX = ((y / rect.height) - 0.5) * -12;
    const rotateY = ((x / rect.width) - 0.5) * 12;

    card.style.transform = `
      perspective(1000px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      translateY(-8px)
      scale(1.02)
    `;
  };

  const resetTilt = (e) => {
    const card = e.currentTarget;
    card.style.transform = `
      perspective(1000px)
      rotateX(0deg)
      rotateY(0deg)
      translateY(0)
      scale(1)
    `;
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@700;800&display=swap');

        body {
          margin: 0;
          font-family: 'Inter', system-ui;
          color: white;
          background:
            radial-gradient(circle at 70% 30%, #1c1cff55, transparent 45%),
            radial-gradient(circle at 30% 70%, #ff1fd655, transparent 50%),
            #05010a;
          overflow-x: hidden;
        }

        canvas {
          position: fixed;
          inset: 0;
          z-index: -1;
        }

        .container {
          max-width: 1300px;
          margin: auto;
          padding: 80px 40px;
        }

        .header {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin-bottom: 80px;
          text-align: center;
        }

        .logo {
          font-family: 'Poppins', sans-serif;
          font-size: 3rem;
          font-weight: 800;
          background: linear-gradient(90deg, #4b6cff, #ff4fd8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: 1px;
          margin-bottom: 12px;
          transition: transform 0.3s ease;
        }

        .logo:hover { transform: scale(1.05); }

        .tagline {
          font-family: 'Inter', sans-serif;
          font-size: 1.2rem;
          font-weight: 500;
          color: rgba(255,255,255,0.8);
          letter-spacing: 0.5px;
          max-width: 600px;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 40px;
        }

        .card {
          background: rgba(255,255,255,0.06);
          backdrop-filter: blur(18px);
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 30px 70px rgba(0,0,0,0.5);
          transition: transform 0.25s ease;
          cursor: pointer;
          transform-style: preserve-3d;
        }

        .media {
          position: relative;
          aspect-ratio: 16 / 9;
        }

        .media img,
        .media video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .media video {
          position: absolute;
          inset: 0;
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.85), transparent);
        }

        .info { padding: 20px; }

        .categoria {
          font-size: 0.75rem;
          opacity: 0.6;
          letter-spacing: 1px;
        }

        .titulo {
          margin-top: 6px;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .player {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.92);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 20;
        }

        video.playerVideo {
          width: 85%;
          max-width: 1100px;
          border-radius: 24px;
        }

        .fechar {
          position: absolute;
          top: 30px;
          right: 40px;
          font-size: 2.2rem;
          cursor: pointer;
        }
      `}</style>

      <canvas ref={canvasRef} />

      <div className="container">
        <header className="header">
          <div className="logo">EducaStream</div>
          <div className="tagline">Aulas Gratuitas</div>
        </header>

        <div className="grid">
          {aulas.map((aula) => (
            <div
              key={aula.id}
              className="card"
              onMouseMove={handleTilt}
              onMouseLeave={resetTilt}
              onMouseEnter={(e) => {
                const video = e.currentTarget.querySelector("video");
                video.currentTime = 0;
                video.style.opacity = 1;
                video.play();
              }}
              onMouseLeaveCapture={(e) => {
                const video = e.currentTarget.querySelector("video");
                video.pause();
                video.currentTime = 0;
                video.style.opacity = 0;
              }}
              onClick={() => setVideoAtivo(aula.video)}
            >
              <div className="media">
                <img src={aula.thumb} />
                <video
                  src={aula.video}
                  muted
                  loop
                  style={{ opacity: 0, transition: "opacity 0.4s ease" }}
                />
                <div className="overlay" />
              </div>

              <div className="info">
                <div className="categoria">{aula.categoria}</div>
                <div className="titulo">{aula.titulo}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {videoAtivo && (
        <div className="player">
          <span className="fechar" onClick={() => setVideoAtivo(null)}>✕</span>
          <video className="playerVideo" src={videoAtivo} controls autoPlay />
        </div>
      )}
    </>
  );
}
