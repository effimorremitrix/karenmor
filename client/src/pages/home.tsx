import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  Phone,
  Mail,
  MapPin,
  Heart,
  Brain,
  Users,
  BookOpen,
  MessageCircle,
  Sparkles,
  Award,
  Clock,
  ChevronDown,
  Menu,
  X,
  Quote,
  Calendar,
  GraduationCap,
  Puzzle,
  HandHeart,
  Target,
} from "lucide-react";
import { SiWhatsapp } from "react-icons/si";

import heroImage from "@assets/stock_images/child_psychologist_f_553cfd6d.jpg";
import profileImage from "@assets/stock_images/female_psychologist__eef50910.jpg";
import therapyRoomImage from "@assets/stock_images/child_therapy_room_c_9078bcae.jpg";
import parentMeetingImage from "@assets/stock_images/parent_meeting_couns_e8f9549b.jpg";

const contactFormSchema = z.object({
  name: z.string().min(2, "נא להזין שם מלא"),
  email: z.string().email("נא להזין כתובת אימייל תקינה"),
  phone: z.string().min(9, "נא להזין מספר טלפון תקין"),
  message: z.string().min(10, "נא להזין הודעה"),
  preferredContact: z.enum(["phone", "email", "whatsapp"]),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const services = [
  {
    icon: Heart,
    title: "טיפול פרטני",
    description: "טיפול רגשי והתנהגותי מותאם אישית לילדים ומתבגרים. אני מאמינה שכל ילד הוא עולם ומלואו ודורש גישה ייחודית.",
  },
  {
    icon: Brain,
    title: "אבחון התפתחותי",
    description: "הערכה מקיפה של ההתפתחות הקוגניטיבית, הרגשית והחברתית. האבחון מספק תמונה ברורה ומפת דרכים להמשך.",
  },
  {
    icon: Users,
    title: "הדרכת הורים",
    description: "ייעוץ והדרכה להורים להתמודדות עם אתגרים בבית ובבית הספר. אני מלווה אתכם ביצירת שינוי משמעותי.",
  },
  {
    icon: MessageCircle,
    title: "טיפול קבוצתי",
    description: "קבוצות מיומנויות חברתיות וסדנאות לוויסות רגשי. הקבוצות מספקות סביבה בטוחה לצמיחה.",
  },
  {
    icon: BookOpen,
    title: "ייעוץ חינוכי",
    description: "תמיכה למורים ולצוותי חינוך בהתמודדות עם קשיים לימודיים והתנהגותיים בכיתה.",
  },
];

const specializations = [
  { icon: Sparkles, label: "ויסות רגשי" },
  { icon: Puzzle, label: "לקויות למידה" },
  { icon: Target, label: "אתגרים התנהגותיים" },
  { icon: Users, label: "מיומנויות חברתיות" },
  { icon: HandHeart, label: "הדרכת הורים" },
  { icon: GraduationCap, label: "ייעוץ חינוכי" },
];

const testimonials = [
  {
    quote: "קארן עזרה לבן שלי להתגבר על חרדה חברתית בצורה מדהימה. הגישה החמה והמקצועית שלה עשתה את כל ההבדל.",
    author: "מיכל, אמא לילד בן 9",
  },
  {
    quote: "ההדרכה שקיבלנו כהורים שינתה לחלוטין את האווירה בבית. סוף סוף יש לנו כלים אמיתיים להתמודדות.",
    author: "דני ושרית, הורים לשני ילדים",
  },
  {
    quote: "האבחון המקיף והמדויק נתן לנו את הכיוון הנכון. קארן מקצועית, אכפתית ומסורה.",
    author: "יעל, אמא לילדה בת 7",
  },
];

const workshops = [
  {
    title: "קבוצת מיומנויות חברתיות",
    description: "לילדים בגילאי 8-12. פיתוח יכולות תקשורת, יצירת קשרים והתמודדות עם קונפליקטים.",
    icon: Users,
  },
  {
    title: "סדנת ויסות רגשי להורים",
    description: "כלים מעשיים להורים להתמודדות עם התקפי זעם, תסכולים ורגשות עזים אצל ילדים.",
    icon: Heart,
  },
  {
    title: "מפגשי הדרכת הורים",
    description: "מפגשים קבוצתיים להורים לשיתוף, למידה ותמיכה הדדית בנושאי חינוך והורות.",
    icon: HandHeart,
  },
];

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
      preferredContact: "phone",
    },
  });

  const contactMutation = useMutation({
    mutationFn: async (data: ContactFormValues) => {
      return apiRequest("POST", "/api/contact", data);
    },
    onSuccess: () => {
      toast({
        title: "ההודעה נשלחה בהצלחה!",
        description: "אחזור אליך בהקדם האפשרי.",
      });
      form.reset();
    },
    onError: () => {
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה בשליחת ההודעה. נסה שוב.",
        variant: "destructive",
      });
    },
  });

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 right-0 left-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16 gap-4">
            <button
              onClick={() => scrollToSection("hero")}
              className="text-xl font-bold text-foreground"
              data-testid="link-logo"
            >
              קארן מור
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6 flex-wrap">
              <button
                onClick={() => scrollToSection("about")}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-about"
              >
                אודות
              </button>
              <button
                onClick={() => scrollToSection("services")}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-services"
              >
                שירותים
              </button>
              <button
                onClick={() => scrollToSection("specializations")}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-specializations"
              >
                התמחויות
              </button>
              <button
                onClick={() => scrollToSection("testimonials")}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-testimonials"
              >
                המלצות
              </button>
              <button
                onClick={() => scrollToSection("workshops")}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-workshops"
              >
                סדנאות
              </button>
              <Button
                onClick={() => scrollToSection("contact")}
                data-testid="button-contact-nav"
              >
                צרו קשר
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-background border-b border-border">
            <div className="flex flex-col p-4 gap-4">
              <button
                onClick={() => scrollToSection("about")}
                className="text-right py-2 text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-about-mobile"
              >
                אודות
              </button>
              <button
                onClick={() => scrollToSection("services")}
                className="text-right py-2 text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-services-mobile"
              >
                שירותים
              </button>
              <button
                onClick={() => scrollToSection("specializations")}
                className="text-right py-2 text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-specializations-mobile"
              >
                התמחויות
              </button>
              <button
                onClick={() => scrollToSection("testimonials")}
                className="text-right py-2 text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-testimonials-mobile"
              >
                המלצות
              </button>
              <button
                onClick={() => scrollToSection("workshops")}
                className="text-right py-2 text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-workshops-mobile"
              >
                סדנאות
              </button>
              <Button
                onClick={() => scrollToSection("contact")}
                className="w-full"
                data-testid="button-contact-mobile"
              >
                צרו קשר
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section
        id="hero"
        className="relative min-h-[80vh] flex items-center justify-center pt-16"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-l from-black/70 via-black/50 to-black/70" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <Badge className="mb-6 bg-white/10 text-white border-white/20 backdrop-blur-sm">
            <Award className="w-4 h-4 ml-2" />
            15+ שנות ניסיון מקצועי
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            קארן מור
            <br />
            <span className="text-primary-foreground/90">פסיכולוגית חינוכית מומחית ומטפלת זוגית משפחתית מוסמכת</span>
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-8 leading-relaxed">
            אני מאמינה שכל ילד מחזיק בתוכו פוטנציאל עצום. התפקיד שלי הוא ללוות אותו ואת משפחתו בדרך לגילוי הכוחות הייחודיים שלו ולצמיחה רגשית וחינוכית.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => scrollToSection("contact")}
              className="bg-primary text-primary-foreground"
              data-testid="button-hero-cta"
            >
              קבעו פגישת היכרות
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => scrollToSection("about")}
              className="bg-white/10 text-white border-white/30 backdrop-blur-sm"
              data-testid="button-hero-learn-more"
            >
              קראו עוד עליי
            </Button>
          </div>
          <button
            onClick={() => scrollToSection("about")}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/70 hover:text-white transition-colors animate-bounce"
            aria-label="גלול למטה"
          >
            <ChevronDown className="w-8 h-8" />
          </button>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <Badge className="mb-4">אודות</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                היכרות קצרה
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  אני קארן מור, פסיכולוגית חינוכית מומחית ומטפלת זוגית משפחתית מוסמכת. הקליניקה שלי ממוקמת בנתניה ואני עובדת עם ילדים, מתבגרים, זוגות ומשפחות.
                </p>
                <p>
                  לאורך השנים פיתחתי גישה טיפולית שמשלבת חמימות אנושית עם מקצועיות. אני מאמינה בשיתוף פעולה הדוק עם ההורים ועם הצוות החינוכי כדי לתת לכל ילד את התמיכה הטובה ביותר.
                </p>
                <p>
                  המומחיות שלי כוללת ויסות רגשי, לקויות למידה, אתגרים התנהגותיים ופיתוח מיומנויות חברתיות. אני כאן כדי ללוות אתכם בכל אתגר.
                </p>
              </div>
              <div className="flex items-center gap-4 mt-8">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-5 h-5 text-primary" />
                  <span>שעות קבלה גמישות</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span>נתניה</span>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2 relative">
              <img
                src={profileImage}
                alt="קארן מור - פסיכולוגית חינוכית מומחית"
                className="rounded-lg w-full object-cover aspect-[4/3]"
                data-testid="img-profile"
              />
              <div className="absolute -bottom-6 -right-6 hidden md:block">
                <img
                  src={therapyRoomImage}
                  alt="חדר טיפולים"
                  className="rounded-lg w-48 h-32 object-cover border-4 border-background"
                  data-testid="img-therapy-room"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 md:py-24 bg-card">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <Badge className="mb-4">שירותים</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              השירותים שלי
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              אני מציעה מגוון שירותים מקצועיים לילדים, מתבגרים ומשפחות. כל שירות מותאם אישית לצרכים הייחודיים של כל ילד ומשפחה.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <Card
                key={index}
                className="hover-elevate transition-all duration-300"
                data-testid={`card-service-${index}`}
              >
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <service.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Specializations Section */}
      <section id="specializations" className="py-16 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <Badge className="mb-4">התמחויות</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              תחומי המומחיות שלי
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              התמחיתי במגוון תחומים כדי לתת מענה מקיף ומקצועי לכל ילד ומשפחה
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {specializations.map((spec, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="py-3 px-5 text-base"
                data-testid={`badge-spec-${index}`}
              >
                <spec.icon className="w-5 h-5 ml-2" />
                {spec.label}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Why Work With Me Section */}
      <section className="py-16 md:py-24 bg-card">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <Badge className="mb-4">למה לבחור בי</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              הגישה הטיפולית שלי
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src={parentMeetingImage}
                alt="פגישת ייעוץ להורים"
                className="rounded-lg w-full object-cover aspect-video"
                data-testid="img-parent-meeting"
              />
            </div>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Heart className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">גישה חמה ומקבלת</h3>
                  <p className="text-muted-foreground">
                    אני יוצרת סביבה בטוחה ומקבלת שמאפשרת לילד להיפתח ולהתפתח בקצב שלו.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">שיתוף פעולה עם ההורים</h3>
                  <p className="text-muted-foreground">
                    אני מאמינה בשותפות מלאה עם ההורים. אתם חלק בלתי נפרד מהתהליך הטיפולי.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Target className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">תכנית טיפול מותאמת</h3>
                  <p className="text-muted-foreground">
                    כל תכנית טיפול נבנית באופן אישי ומותאמת לצרכים הייחודיים של הילד והמשפחה.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <Badge className="mb-4">המלצות</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              מה הורים אומרים
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="bg-card"
                data-testid={`card-testimonial-${index}`}
              >
                <CardContent className="p-6">
                  <Quote className="w-8 h-8 text-primary/30 mb-4" />
                  <p className="text-foreground leading-relaxed mb-4">
                    "{testimonial.quote}"
                  </p>
                  <p className="text-sm text-muted-foreground font-medium">
                    — {testimonial.author}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Workshops Section */}
      <section id="workshops" className="py-16 md:py-24 bg-card">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <Badge className="mb-4">סדנאות ותוכניות</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              קבוצות וסדנאות
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              בנוסף לטיפול הפרטני, אני מציעה מגוון קבוצות וסדנאות לילדים ולהורים
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {workshops.map((workshop, index) => (
              <Card
                key={index}
                className="hover-elevate transition-all duration-300"
                data-testid={`card-workshop-${index}`}
              >
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center mb-4">
                    <workshop.icon className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {workshop.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {workshop.description}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => scrollToSection("contact")}
                    data-testid={`button-workshop-inquiry-${index}`}
                  >
                    <Calendar className="w-4 h-4 ml-2" />
                    לפרטים נוספים
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <Badge className="mb-4">צור קשר</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              בואו נדבר
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              מוזמנים ליצור קשר לקביעת פגישת היכרות או לכל שאלה. אני כאן בשבילכם.
            </p>
          </div>
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card data-testid="card-contact-form">
              <CardContent className="p-6 md:p-8">
                <h3 className="text-xl font-semibold text-foreground mb-6">
                  השאירו פרטים
                </h3>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit((data) => contactMutation.mutate(data))}
                    className="space-y-6"
                  >
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>שם מלא</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="הזינו את שמכם"
                              {...field}
                              data-testid="input-name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>אימייל</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="example@email.com"
                                {...field}
                                data-testid="input-email"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>טלפון</FormLabel>
                            <FormControl>
                              <Input
                                type="tel"
                                placeholder="052-XXXXXXX"
                                {...field}
                                data-testid="input-phone"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>הודעה</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="ספרו לי קצת על עצמכם ובמה אוכל לעזור..."
                              className="min-h-[120px]"
                              {...field}
                              data-testid="input-message"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="preferredContact"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>דרך יצירת קשר מועדפת</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-wrap gap-4"
                            >
                              <div className="flex items-center gap-2">
                                <RadioGroupItem
                                  value="phone"
                                  id="phone"
                                  data-testid="radio-phone"
                                />
                                <Label htmlFor="phone">טלפון</Label>
                              </div>
                              <div className="flex items-center gap-2">
                                <RadioGroupItem
                                  value="email"
                                  id="email"
                                  data-testid="radio-email"
                                />
                                <Label htmlFor="email">אימייל</Label>
                              </div>
                              <div className="flex items-center gap-2">
                                <RadioGroupItem
                                  value="whatsapp"
                                  id="whatsapp"
                                  data-testid="radio-whatsapp"
                                />
                                <Label htmlFor="whatsapp">וואטסאפ</Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={contactMutation.isPending}
                      data-testid="button-submit-contact"
                    >
                      {contactMutation.isPending ? "שולח..." : "שלחו הודעה"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <div className="space-y-6">
              <Card data-testid="card-contact-info">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-6">
                    פרטי התקשרות
                  </h3>
                  <div className="space-y-4">
                    <a
                      href="tel:052-5624642"
                      className="flex items-center gap-4 p-3 rounded-lg hover-elevate transition-colors"
                      data-testid="link-phone"
                    >
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Phone className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">טלפון</p>
                        <p className="font-medium text-foreground">052-5624642</p>
                      </div>
                    </a>
                    <a
                      href="https://wa.me/972525624642"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-3 rounded-lg hover-elevate transition-colors"
                      data-testid="link-whatsapp"
                    >
                      <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                        <SiWhatsapp className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">וואטסאפ</p>
                        <p className="font-medium text-foreground">שלחו הודעה</p>
                      </div>
                    </a>
                    <a
                      href="mailto:info@karenmor.com"
                      className="flex items-center gap-4 p-3 rounded-lg hover-elevate transition-colors"
                      data-testid="link-email"
                    >
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Mail className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">אימייל</p>
                        <p className="font-medium text-foreground">info@karenmor.com</p>
                      </div>
                    </a>
                    <div className="flex items-center gap-4 p-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">כתובת</p>
                        <p className="font-medium text-foreground">יהודה הלוי 28, נתניה</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card data-testid="card-office-hours">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-4">
                    שעות פעילות
                  </h3>
                  <div className="space-y-2 text-muted-foreground">
                    <div className="flex justify-between gap-4">
                      <span>ראשון - חמישי</span>
                      <span className="font-medium text-foreground">08:00 - 20:00</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span>שישי</span>
                      <span className="font-medium text-foreground">08:00 - 13:00</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span>שבת</span>
                      <span className="font-medium text-foreground">סגור</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold text-foreground mb-4">קארן מור</h3>
              <p className="text-muted-foreground leading-relaxed">
                פסיכולוגית חינוכית מומחית ומטפלת זוגית משפחתית מוסמכת בנתניה. ליווי מקצועי והוליסטי לילדים, זוגות ומשפחות.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">קישורים מהירים</h4>
              <div className="space-y-2">
                <button
                  onClick={() => scrollToSection("about")}
                  className="block text-muted-foreground hover:text-foreground transition-colors"
                >
                  אודות
                </button>
                <button
                  onClick={() => scrollToSection("services")}
                  className="block text-muted-foreground hover:text-foreground transition-colors"
                >
                  שירותים
                </button>
                <button
                  onClick={() => scrollToSection("workshops")}
                  className="block text-muted-foreground hover:text-foreground transition-colors"
                >
                  סדנאות
                </button>
                <button
                  onClick={() => scrollToSection("contact")}
                  className="block text-muted-foreground hover:text-foreground transition-colors"
                >
                  צור קשר
                </button>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">יצירת קשר</h4>
              <div className="space-y-2 text-muted-foreground">
                <p>טלפון: 052-5624642</p>
                <p>אימייל: info@karenmor.com</p>
                <p>יהודה הלוי 28, נתניה</p>
              </div>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} קארן מור - כל הזכויות שמורות</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
