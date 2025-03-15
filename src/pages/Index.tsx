
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Brain, 
  Lock, 
  Clock, 
  BarChart, 
  CheckCircle, 
  ClipboardList,
  ArrowRight,
  LightbulbIcon,
  BookOpen,
  Shield,
} from 'lucide-react';

const Index = () => {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Features Section */}
      <FeaturesSection />
      
      {/* How It Works Section */}
      <HowItWorksSection />
      
      {/* Stats Section */}
      <StatsSection />
      
      {/* Testimonials */}
      <TestimonialsSection />
      
      {/* CTA Section */}
      <CTASection />
    </div>
  );
};

const HeroSection = () => {
  return (
    <section className="relative py-20 md:py-28">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center mb-6"
          >
            <div className="relative w-16 h-16">
              <Brain className="absolute text-primary w-16 h-16" />
              <Lock className="absolute text-primary/70 w-16 h-16 transform translate-x-2 translate-y-2" />
            </div>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold tracking-tight mb-6"
          >
            Unlock Your<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
              Deep Focus Potential
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
          >
            MindLock helps you master complex subjects through deliberate practice,
            eliminating distractions and building deep understanding through focused problem-solving.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button asChild size="lg" className="rounded-full px-8 shadow-lg hover:shadow-xl hover:scale-105 transition-all">
              <Link to="/questions">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full px-8">
              <Link to="/about">Learn More</Link>
            </Button>
          </motion.div>
        </div>
        
        {/* Hero Image/Visual */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="max-w-5xl mx-auto mt-16"
        >
          <div className="glass-morphism rounded-2xl p-1 shadow-xl">
            <div className="rounded-xl overflow-hidden bg-card">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=675&q=80"
                alt="Students working on problems"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const FeaturesSection = () => {
  const features = [
    {
      icon: <ClipboardList className="w-12 h-12 text-primary" />,
      title: 'Question Management',
      description: 'Organize, tag, and categorize your questions by course, difficulty, and topic for efficient studying.'
    },
    {
      icon: <Shield className="w-12 h-12 text-primary" />,
      title: 'Distraction-Free Mode',
      description: 'Lock yourself into a single problem for deep focus, preventing context switching and procrastination.'
    },
    {
      icon: <Clock className="w-12 h-12 text-primary" />,
      title: 'Timed Practice',
      description: 'Simulate exam conditions with customizable timers and track your progress over time.'
    },
    {
      icon: <BarChart className="w-12 h-12 text-primary" />,
      title: 'Performance Analytics',
      description: 'Visualize your study patterns, identify weak areas, and focus your efforts where they matter most.'
    },
    {
      icon: <LightbulbIcon className="w-12 h-12 text-primary" />,
      title: 'Adaptive Learning',
      description: 'Receive personalized question recommendations based on your performance and learning goals.'
    },
    {
      icon: <BookOpen className="w-12 h-12 text-primary" />,
      title: 'Study Planning',
      description: 'Schedule structured practice sessions and track your progress toward mastery of each subject.'
    },
  ];

  return (
    <section className="py-20 bg-secondary/50">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Powerful Features for Deliberate Practice
          </h2>
          <p className="text-lg text-muted-foreground">
            MindLock combines proven learning techniques with advanced technology to help you build lasting knowledge and skills.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border border-border/50 hover:border-primary/30 transition-all hover:shadow-lg group neo-morphism">
              <CardContent className="pt-6">
                <div className="p-4 rounded-full bg-primary/10 inline-block mb-5 group-hover:bg-primary/20 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

const HowItWorksSection = () => {
  const steps = [
    {
      number: '01',
      title: 'Add Your Questions',
      description: 'Import or create questions from your courses and organize them with tags and categories.'
    },
    {
      number: '02',
      title: 'Plan Your Sessions',
      description: 'Set up focused practice sessions with specific time blocks and question sequences.'
    },
    {
      number: '03',
      title: 'Lock In and Focus',
      description: 'Activate distraction-free mode and commit to solving one problem at a time.'
    },
    {
      number: '04',
      title: 'Review and Improve',
      description: 'Analyze your performance, identify weak areas, and adapt your study strategy.'
    }
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            How MindLock Works
          </h2>
          <p className="text-lg text-muted-foreground">
            A simple four-step process to transform your study habits and master complex subjects
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/4 left-full w-full h-1 border-t-2 border-dashed border-primary/30 -translate-y-1/2 pointer-events-none"></div>
              )}
              <div className="group hover:-translate-y-2 transition-all duration-300">
                <div className="text-5xl font-bold text-primary/20 mb-4 group-hover:text-primary/30 transition-colors">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const StatsSection = () => {
  return (
    <section className="py-20 bg-primary/5">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {[
            { value: '85%', label: 'Improvement in Exam Scores' },
            { value: '12,000+', label: 'Practice Questions Solved' },
            { value: '45+', label: 'Minutes Saved Per Study Session' },
            { value: '94%', label: 'Student Satisfaction' }
          ].map((stat, index) => (
            <div key={index} className="p-6">
              <div className="text-4xl md:text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
                {stat.value}
              </div>
              <p className="text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "MindLock transformed my study habits. I've never been able to focus this deeply before, and my exam scores have improved dramatically.",
      author: "Alex Chen",
      role: "Computer Science Student"
    },
    {
      quote: "The distraction-free mode is a game-changer. It's like having a personal coach that keeps me accountable and focused on one problem at a time.",
      author: "Sarah Johnson",
      role: "Medical Student"
    },
    {
      quote: "I used to struggle with time management during exams. MindLock's timed practice sessions helped me build the stamina I needed to excel.",
      author: "Raj Patel",
      role: "Engineering Graduate"
    }
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            What Our Users Say
          </h2>
          <p className="text-lg text-muted-foreground">
            Join thousands of students who have transformed their learning with MindLock
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="glass-morphism">
              <CardContent className="p-8">
                <div className="mb-6 text-4xl text-primary/20">"</div>
                <p className="mb-6 text-lg">{testimonial.quote}</p>
                <div>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

const CTASection = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <div className="rounded-2xl bg-gradient-to-r from-primary/90 to-blue-600 py-16 px-8 text-center text-white">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Learning Experience?
            </h2>
            <p className="text-lg mb-10 opacity-90">
              Join MindLock today and discover the power of focused, deliberate practice. Your journey to mastery starts here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="rounded-full px-8 text-primary shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                <Link to="/questions">Get Started Now</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full px-8 border-white text-white hover:bg-white/10">
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Index;
