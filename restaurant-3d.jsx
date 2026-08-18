import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { Camera, ChefHat, MapPin, Clock, Phone, Mail } from 'lucide-react';

const Restaurant3D = () => {
  const canvasRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    camera.position.z = 5;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xd4af37, 2, 100);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x8b4789, 1.5, 100);
    pointLight2.position.set(-5, -5, 5);
    scene.add(pointLight2);

    // Create elegant geometric shapes
    const geometries = [];

    // Golden ring/torus
    const torusGeometry = new THREE.TorusGeometry(1.2, 0.15, 16, 100);
    const torusMaterial = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.8,
      roughness: 0.2,
      emissive: 0xd4af37,
      emissiveIntensity: 0.1
    });
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);
    torus.position.set(-2, 1, 0);
    scene.add(torus);
    geometries.push(torus);

    // Purple diamond/octahedron
    const octahedronGeometry = new THREE.OctahedronGeometry(0.8, 0);
    const octahedronMaterial = new THREE.MeshStandardMaterial({
      color: 0x8b4789,
      metalness: 0.9,
      roughness: 0.1,
      emissive: 0x8b4789,
      emissiveIntensity: 0.15
    });
    const octahedron = new THREE.Mesh(octahedronGeometry, octahedronMaterial);
    octahedron.position.set(2, -1, 0);
    scene.add(octahedron);
    geometries.push(octahedron);

    // Emerald sphere
    const sphereGeometry = new THREE.SphereGeometry(0.6, 32, 32);
    const sphereMaterial = new THREE.MeshStandardMaterial({
      color: 0x2d5f4f,
      metalness: 0.7,
      roughness: 0.3,
      emissive: 0x2d5f4f,
      emissiveIntensity: 0.1
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(0, 2, -2);
    scene.add(sphere);
    geometries.push(sphere);

    // Deep blue icosahedron
    const icosahedronGeometry = new THREE.IcosahedronGeometry(0.7, 0);
    const icosahedronMaterial = new THREE.MeshStandardMaterial({
      color: 0x1e3a5f,
      metalness: 0.85,
      roughness: 0.15,
      emissive: 0x1e3a5f,
      emissiveIntensity: 0.12
    });
    const icosahedron = new THREE.Mesh(icosahedronGeometry, icosahedronMaterial);
    icosahedron.position.set(-1, -2, -1);
    scene.add(icosahedron);
    geometries.push(icosahedron);

    // Animation
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (event) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      requestAnimationFrame(animate);

      // Rotate geometries
      geometries.forEach((geo, index) => {
        geo.rotation.x += 0.005 + index * 0.001;
        geo.rotation.y += 0.005 + index * 0.001;

        // Mouse interaction
        geo.position.x += (mouseX * (index + 1) * 0.3 - geo.position.x) * 0.02;
        geo.position.y += (mouseY * (index + 1) * 0.3 - geo.position.y) * 0.02;
      });

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  const menuItems = [
    {
      name: "Truffle Risotto",
      description: "Arborio rice, black truffle, parmesan, white wine",
      price: "$48"
    },
    {
      name: "Wagyu Tenderloin",
      description: "A5 Japanese wagyu, seasonal vegetables, red wine reduction",
      price: "$125"
    },
    {
      name: "Mediterranean Sea Bass",
      description: "Wild-caught, herb crust, lemon butter, asparagus",
      price: "$62"
    },
    {
      name: "Chocolate Sphere",
      description: "Dark chocolate shell, passion fruit mousse, gold leaf",
      price: "$24"
    }
  ];

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-x-hidden">
      {/* 3D Canvas Background */}
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full -z-10 opacity-60"
        style={{ transform: `translateY(${scrollY * 0.5}px)` }}
      />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
            Ember & Spice
          </h1>
          <div className="flex gap-8">
            <a href="#menu" className="hover:text-amber-400 transition-colors">Menu</a>
            <a href="#about" className="hover:text-purple-400 transition-colors">About</a>
            <a href="#contact" className="hover:text-emerald-400 transition-colors">Contact</a>
            <button className="px-6 py-2 bg-gradient-to-r from-amber-500 to-purple-600 rounded-full hover:shadow-lg hover:shadow-purple-500/50 transition-all">
              Reserve
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="text-center max-w-4xl">
          <h2 className="text-7xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-amber-300 via-purple-300 to-emerald-300 bg-clip-text text-transparent leading-tight">
            A Culinary Journey
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed">
            Where bold flavors meet artistic presentation in an atmosphere of refined elegance
          </p>
          <div className="flex gap-6 justify-center flex-wrap">
            <button className="px-8 py-4 bg-gradient-to-r from-amber-500 via-purple-600 to-emerald-500 rounded-full text-lg font-semibold hover:shadow-2xl hover:shadow-purple-500/50 transition-all transform hover:scale-105">
              Book a Table
            </button>
            <button className="px-8 py-4 border-2 border-purple-400 rounded-full text-lg font-semibold hover:bg-purple-400/20 transition-all">
              View Menu
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-6 bg-black/30 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h3 className="text-5xl font-bold mb-6 bg-gradient-to-r from-amber-400 to-purple-400 bg-clip-text text-transparent">
                Our Story
              </h3>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                Born from a passion for culinary excellence and a desire to create unforgettable dining experiences,
                Ember & Spice represents the perfect fusion of traditional techniques and contemporary innovation.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed mb-8">
                Our award-winning chef brings together the finest seasonal ingredients, sourced from local farms and
                international purveyors, to craft dishes that tell a story with every bite.
              </p>
              <div className="flex gap-8">
                <div className="flex items-start gap-3">
                  <ChefHat className="w-8 h-8 text-amber-400 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-lg">Michelin Trained</p>
                    <p className="text-gray-400">World-class culinary expertise</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Camera className="w-8 h-8 text-purple-400 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-lg">Instagram Worthy</p>
                    <p className="text-gray-400">Art on every plate</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl shadow-purple-500/30">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 via-purple-500/20 to-emerald-500/20 backdrop-blur-sm flex items-center justify-center">
                <ChefHat className="w-32 h-32 text-white/40" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Preview */}
      <section id="menu" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-5xl font-bold mb-4 text-center bg-gradient-to-r from-purple-400 to-emerald-400 bg-clip-text text-transparent">
            Signature Dishes
          </h3>
          <p className="text-center text-gray-400 text-lg mb-16">
            A curated selection of our most celebrated creations
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            {menuItems.map((item, index) => (
              <div
                key={index}
                className="group p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10 hover:border-purple-400/50 transition-all hover:shadow-xl hover:shadow-purple-500/20 transform hover:scale-105"
              >
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-2xl font-bold text-white group-hover:text-amber-400 transition-colors">
                    {item.name}
                  </h4>
                  <span className="text-2xl font-bold text-amber-400">
                    {item.price}
                  </span>
                </div>
                <p className="text-gray-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-emerald-600 rounded-full text-lg font-semibold hover:shadow-2xl hover:shadow-emerald-500/50 transition-all transform hover:scale-105">
              View Full Menu
            </button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-6 bg-black/30 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-5xl font-bold mb-16 text-center bg-gradient-to-r from-emerald-400 to-amber-400 bg-clip-text text-transparent">
            Visit Us
          </h3>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
              <MapPin className="w-12 h-12 text-amber-400 mx-auto mb-4" />
              <h4 className="text-xl font-bold mb-2">Location</h4>
              <p className="text-gray-400">123 Culinary Boulevard<br/>Downtown District, NY 10001</p>
            </div>
            <div className="text-center p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
              <Clock className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h4 className="text-xl font-bold mb-2">Hours</h4>
              <p className="text-gray-400">Tue - Sat: 5:00 PM - 11:00 PM<br/>Sun: 4:00 PM - 10:00 PM<br/>Mon: Closed</p>
            </div>
            <div className="text-center p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
              <Phone className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
              <h4 className="text-xl font-bold mb-2">Contact</h4>
              <p className="text-gray-400">+1 (555) 123-4567<br/>info@emberandspice.com</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-amber-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
            Ember & Spice
          </h2>
          <p className="text-gray-400 mb-6">
            An elevated dining experience where passion meets perfection
          </p>
          <div className="flex justify-center gap-6 text-sm text-gray-500">
            <span>© 2026 Ember & Spice</span>
            <span>•</span>
            <a href="#" className="hover:text-purple-400 transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-amber-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Restaurant3D;