using System;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Models;
using Microsoft.EntityFrameworkCore.Metadata;

#nullable disable

namespace WebApplication1
{
    public partial class DBContext : DbContext
    {
        public DBContext()
        {
        }

        public DBContext(DbContextOptions<DBContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Answer> Answers { get; set; }
        public virtual DbSet<Question> Questions { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        { 
            /*
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseNpgsql("Host=ec2-54-198-73-79.compute-1.amazonaws.com;Port=5432;Database=dm32jm37cam5l;Username=nubnqeaebxzkbb;Password=1ae778c58a94903aec193b54c131ed1cd558a7364c0659aea6907c17445dedc5;SslMode=Require;Trustservercertificate=true");
            }*/
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.HasAnnotation("Relational:Collation", "en_US.UTF-8");

            modelBuilder.Entity<Answer>(entity =>
            {
                entity.ToTable("answer");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Result)
                    .IsRequired()
                    .HasColumnType("character varying")
                    .HasColumnName("result");

                entity.Property(e => e.Type)
                    .IsRequired()
                    .HasColumnType("character varying")
                    .HasColumnName("type");

                entity.HasOne(d => d.Question)
                .WithMany(q => q.Answers).HasForeignKey(d => d.QuestionId);
            });

            modelBuilder.Entity<Question>(entity =>
            {
                entity.ToTable("question");

                entity.Property(e => e.Id)
                    .ValueGeneratedOnAdd()
                    .HasColumnName("id");

                entity.Property(e => e.NextQues1).HasColumnName("next_ques1");
                entity.Property(e => e.NextQues2).HasColumnName("next_ques2");


                entity.Property(e => e.Ques)
                    .HasColumnType("character varying")
                    .HasColumnName("ques");

                entity.Property(e => e.Type)
                    .HasColumnType("character varying")
                    .HasColumnName("type");

            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
