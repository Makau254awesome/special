import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Heart, Cake } from "lucide-react";
import { motion } from "framer-motion";
import { isSameDay } from "date-fns";

const BIRTHDAYS = [
  { name: "Partner 1", date: new Date(2000, 2, 15), emoji: "🎂" }, // March 15
  { name: "Partner 2", date: new Date(2000, 6, 22), emoji: "🎂" }, // July 22
];

const ANNIVERSARY = { name: "Our Anniversary", date: new Date(2023, 1, 14), emoji: "💕" };

const CalendarSection = () => {
  const [selected, setSelected] = useState<Date | undefined>(new Date());

  const specialDays = [...BIRTHDAYS, ANNIVERSARY];

  const isBirthday = (date: Date) =>
    BIRTHDAYS.some((b) => b.date.getMonth() === date.getMonth() && b.date.getDate() === date.getDate());

  const isAnniversary = (date: Date) =>
    ANNIVERSARY.date.getMonth() === date.getMonth() && ANNIVERSARY.date.getDate() === date.getDate();

  const getSpecialDay = (date: Date) =>
    specialDays.find(
      (s) => s.date.getMonth() === date.getMonth() && s.date.getDate() === date.getDate()
    );

  const selectedSpecial = selected ? getSpecialDay(selected) : null;

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold text-foreground">Our Calendar</h2>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-card rounded-2xl border border-border p-4 shadow-sm">
          <Calendar
            mode="single"
            selected={selected}
            onSelect={setSelected}
            className="pointer-events-auto"
            modifiers={{
              birthday: (date) => isBirthday(date),
              anniversary: (date) => isAnniversary(date),
            }}
            modifiersClassNames={{
              birthday: "bg-love-gold/30 text-foreground font-bold rounded-full",
              anniversary: "bg-primary/20 text-primary font-bold rounded-full",
            }}
          />
        </div>

        <div className="space-y-4">
          {selectedSpecial && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-br from-love-blush to-love-pink p-6 rounded-2xl border border-border"
            >
              <span className="text-4xl">{selectedSpecial.emoji}</span>
              <h3 className="font-display text-xl font-bold text-foreground mt-2">
                {selectedSpecial.name}
              </h3>
              <p className="text-muted-foreground font-body text-sm mt-1">
                {selectedSpecial.date.toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </motion.div>
          )}

          <div className="bg-card rounded-2xl border border-border p-5">
            <h3 className="font-display text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Cake className="w-5 h-5 text-love-gold" />
              Special Dates
            </h3>
            <div className="space-y-3">
              {specialDays.map((day) => (
                <div key={day.name} className="flex items-center gap-3 font-body">
                  <span className="text-xl">{day.emoji}</span>
                  <div>
                    <p className="font-bold text-foreground text-sm">{day.name}</p>
                    <p className="text-muted-foreground text-xs">
                      {day.date.toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarSection;
