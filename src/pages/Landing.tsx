import { ArrowRight, CheckCircle, Fingerprint, Activity, Shield, BarChart3, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Landing() {
  const features = [
    {
      icon: Fingerprint,
      title: 'Biometric Authentication',
      description: 'Secure fingerprint-based attendance with ESP32 devices',
    },
    {
      icon: Activity,
      title: 'Real-time Monitoring',
      description: 'Live updates every 5 seconds with instant notifications',
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security with duplicate detection',
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Comprehensive reports and attendance insights',
    },
    {
      icon: Clock,
      title: 'Automated Tracking',
      description: 'Eliminate manual processes and save time',
    },
    {
      icon: Users,
      title: 'Student Management',
      description: 'Complete profiles with attendance history',
    },
  ];

  const stats = [
    { value: '1000+', label: 'Students Tracked' },
    { value: '99.9%', label: 'Uptime' },
    { value: '5s', label: 'Sync Time' },
    { value: '24/7', label: 'Monitoring' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 px-4 py-20 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        
        <div className="relative mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-card px-4 py-2 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-success"></span>
              </span>
              <span className="text-sm font-medium">Live Attendance Tracking</span>
            </div>

            <h1 className="mb-6 text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              Modern Attendance
              <br />
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Management System
              </span>
            </h1>

            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground sm:text-xl">
              Transform your attendance tracking with ESP32-powered fingerprint
              authentication, real-time monitoring, and comprehensive analytics.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" className="group" asChild>
                <Link to="/dashboard">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/devices">View Devices</Link>
              </Button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-20 grid grid-cols-2 gap-6 sm:grid-cols-4"
          >
            {stats.map((stat, index) => (
              <Card key={index} className="border-0 bg-gradient-card shadow-lg">
                <CardContent className="p-6 text-center">
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Powerful Features
            </h2>
            <p className="mx-auto mb-12 max-w-2xl text-lg text-muted-foreground">
              Everything you need to manage attendance efficiently and effectively
            </p>
          </motion.div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-0 bg-gradient-card shadow-lg transition-shadow hover:shadow-xl">
                  <CardContent className="p-6">
                    <div className="mb-4 inline-flex rounded-lg bg-gradient-primary p-3">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="mb-2 text-xl font-semibold text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-gradient-to-br from-primary/5 to-background px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="mb-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Why Choose AttendanceHub?
              </h2>
              <p className="mb-8 text-lg text-muted-foreground">
                Built for educational institutions that demand accuracy, reliability,
                and modern technology.
              </p>

              <div className="space-y-4">
                {[
                  'Real-time synchronization across all devices',
                  'Comprehensive attendance reports and analytics',
                  'Easy integration with ESP32 hardware',
                  'Secure data management and privacy',
                  'Multi-device support with centralized control',
                  'Automated notifications and alerts',
                ].map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle className="h-6 w-6 flex-shrink-0 text-success" />
                    <p className="text-foreground">{benefit}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <Card className="border-0 bg-gradient-card p-8 shadow-2xl">
                <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-primary opacity-20 blur-3xl" />
                <div className="absolute -bottom-4 -left-4 h-32 w-32 rounded-full bg-gradient-success opacity-20 blur-3xl" />
                
                <div className="relative space-y-6">
                  <div className="flex items-center justify-between rounded-lg bg-background/50 p-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Attendance Rate</p>
                      <p className="text-2xl font-bold text-success">96.4%</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-success" />
                  </div>

                  <div className="rounded-lg bg-background/50 p-4">
                    <p className="mb-2 text-sm text-muted-foreground">Active Devices</p>
                    <div className="flex items-center gap-2">
                      <div className="h-2 flex-1 rounded-full bg-muted">
                        <div className="h-2 w-4/5 rounded-full bg-gradient-primary" />
                      </div>
                      <span className="text-sm font-medium">8/10</span>
                    </div>
                  </div>

                  <div className="rounded-lg bg-background/50 p-4">
                    <p className="mb-3 text-sm text-muted-foreground">Recent Activity</p>
                    <div className="space-y-2">
                      {['John Doe marked present', 'Jane Smith marked present', 'Bob Johnson marked present'].map(
                        (activity, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm">
                            <div className="h-2 w-2 rounded-full bg-success" />
                            <span>{activity}</span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="relative overflow-hidden border-0 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-primary opacity-95" />
              <CardContent className="relative p-12 text-center">
                <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
                  Ready to Get Started?
                </h2>
                <p className="mb-8 text-lg text-white/90">
                  Join institutions using modern attendance management
                </p>
                <Button size="lg" variant="secondary" className="group" asChild>
                  <Link to="/dashboard">
                    Access Dashboard
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

// Missing import
import { TrendingUp } from 'lucide-react';
